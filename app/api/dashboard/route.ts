import { getSupabaseAdmin } from '@/app/lib/supabase';
import { logger } from '@/app/lib/logger';
import type { Grade } from '@/app/types';

interface DashboardStats {
  totalAnalyses: number;
  bestScore: { value: number; grade: Grade };
  averageScore: number;
  mostUsedRole: string;
}

interface TrendDataPoint {
  date: string;
  score: number;
}

interface RecentAnalysis {
  id: string;
  date: string;
  prompt: string;
  score: number;
  grade: Grade;
}

interface DashboardResponse {
  stats: DashboardStats;
  trend: TrendDataPoint[];
  recent: RecentAnalysis[];
}

const EMPTY_RESPONSE: DashboardResponse = {
  stats: {
    totalAnalyses: 0,
    bestScore: { value: 0, grade: 'D' },
    averageScore: 0,
    mostUsedRole: '-',
  },
  trend: [],
  recent: [],
};

function getGradeFromScore(score: number): Grade {
  if (score >= 90) return 'S';
  if (score >= 75) return 'A';
  if (score >= 55) return 'B';
  if (score >= 35) return 'C';
  return 'D';
}

export async function GET(request: Request) {
  try {
    // ─── Auth ───
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return Response.json(EMPTY_RESPONSE, { status: 200 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.substring(7));
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // ─── Stats: total count, best score, average score ───
    const { data: allAnalyses, error: statsError } = await supabase
      .from('analyses')
      .select('overall_score, grade, job_role')
      .eq('user_id', userId);

    if (statsError) {
      logger.warn('Dashboard stats query error', { error: statsError.message });
      return Response.json(EMPTY_RESPONSE, { status: 200 });
    }

    if (!allAnalyses || allAnalyses.length === 0) {
      return Response.json(EMPTY_RESPONSE, { status: 200 });
    }

    // Compute stats from results
    const totalAnalyses = allAnalyses.length;

    let bestScoreValue = 0;
    let bestGrade: Grade = 'D';
    let sumScores = 0;
    const roleCounts: Record<string, number> = {};

    for (const row of allAnalyses) {
      const score = row.overall_score || 0;
      sumScores += score;

      if (score > bestScoreValue) {
        bestScoreValue = score;
        bestGrade = (row.grade as Grade) || getGradeFromScore(score);
      }

      const role = row.job_role || 'Other';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    }

    const averageScore = Math.round(sumScores / totalAnalyses);

    let mostUsedRole = 'Other';
    let maxRoleCount = 0;
    for (const [role, count] of Object.entries(roleCounts)) {
      if (count > maxRoleCount) {
        maxRoleCount = count;
        mostUsedRole = role;
      }
    }

    const stats: DashboardStats = {
      totalAnalyses,
      bestScore: { value: bestScoreValue, grade: bestGrade },
      averageScore,
      mostUsedRole,
    };

    // ─── Trend: last 14 days ───
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { data: trendData, error: trendError } = await supabase
      .from('analyses')
      .select('created_at, overall_score')
      .eq('user_id', userId)
      .gte('created_at', fourteenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (trendError) {
      logger.warn('Dashboard trend query error', { error: trendError.message });
    }

    const trend: TrendDataPoint[] = (trendData || []).map((row) => ({
      date: new Date(row.created_at).toISOString().split('T')[0],
      score: row.overall_score || 0,
    }));

    // ─── Recent: last 5 analyses ───
    const { data: recentData, error: recentError } = await supabase
      .from('analyses')
      .select('id, created_at, prompt_text, overall_score, grade')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) {
      logger.warn('Dashboard recent query error', { error: recentError.message });
    }

    const recent: RecentAnalysis[] = (recentData || []).map((row) => ({
      id: row.id,
      date: new Date(row.created_at).toISOString().split('T')[0],
      prompt: row.prompt_text?.substring(0, 80) || '',
      score: row.overall_score || 0,
      grade: (row.grade as Grade) || getGradeFromScore(row.overall_score || 0),
    }));

    return Response.json({ stats, trend, recent }, { status: 200 });
  } catch (error) {
    logger.error('Dashboard error', { error: String(error) });
    return Response.json(EMPTY_RESPONSE, { status: 200 });
  }
}
