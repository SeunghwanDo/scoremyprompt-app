import crypto from 'crypto';
import { getSupabaseAdmin } from '@/app/lib/supabase';

export const runtime = 'nodejs';

async function getRawBody(request: Request): Promise<string> {
  const buffer = await request.arrayBuffer();
  return Buffer.from(buffer).toString('utf-8');
}

function verifyStripeSignature(body: string, signature: string, webhookSecret: string): boolean {
  const hash = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
  return hash === signature;
}

interface StripeEvent {
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return Response.json({ received: true }, { status: 200 });
    }

    const rawBody = await getRawBody(request);
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.warn('Missing Stripe signature header');
      return Response.json({ received: true }, { status: 200 });
    }

    if (!verifyStripeSignature(rawBody, signature, webhookSecret)) {
      console.warn('Invalid Stripe signature');
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event: StripeEvent = JSON.parse(rawBody);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.error('Supabase not configured');
      return Response.json({ received: true }, { status: 200 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = (session.metadata as Record<string, string>)?.userId;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if (userId && stripeCustomerId) {
          const { error } = await supabase
            .from('user_profiles')
            .update({
              tier: 'pro',
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          if (error) console.error('Error updating user profile:', error);
          else console.log(`User ${userId} upgraded to pro tier`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const stripeCustomerId = subscription.customer as string;

        if (stripeCustomerId) {
          const { data: user, error: findError } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('stripe_customer_id', stripeCustomerId)
            .single();

          if (findError) {
            console.error('Error finding user by Stripe customer ID:', findError);
          } else if (user) {
            const { error: updateError } = await supabase
              .from('user_profiles')
              .update({ tier: 'free', updated_at: new Date().toISOString() })
              .eq('id', user.id);

            if (updateError) console.error('Error downgrading user:', updateError);
            else console.log(`User ${user.id} downgraded to free tier`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const stripeCustomerId = invoice.customer as string;

        if (stripeCustomerId) {
          const { data: user, error: findError } = await supabase
            .from('user_profiles')
            .select('id, email')
            .eq('stripe_customer_id', stripeCustomerId)
            .single();

          if (!findError && user) {
            console.warn(`Payment failed for user ${user.id} (${user.email}). Invoice: ${invoice.id}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ received: true }, { status: 200 });
  }
}
