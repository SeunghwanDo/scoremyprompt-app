export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Can I cancel?',
    answer: 'Yes, you can cancel your subscription at any time. You will not be charged for the next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal through Stripe.',
  },
  {
    question: 'What happens after my free trial?',
    answer: 'After 7 days, your subscription will automatically begin. You can cancel anytime before the trial ends to avoid charges.',
  },
  {
    question: 'Is there a refund policy?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact our support team for a full refund.',
  },
];
