import type { DeployedProject, ProjectMetrics } from './types';

const TIMEOUT_MS = 5000;

/**
 * Query a project's Supabase PostgREST API for a count.
 * Uses Accept-Profile header to access the auth schema.
 */
async function queryCount(
  projectUrl: string,
  serviceKey: string,
  schema: string,
  table: string,
  filter?: string,
  signal?: AbortSignal
): Promise<number | null> {
  const params = new URLSearchParams({ select: '*' });
  if (filter) {
    // filter is in PostgREST syntax, e.g. "created_at=gte.2024-01-01T00:00:00Z"
    const [key, val] = filter.split('=');
    params.set(key, val);
  }

  const url = `${projectUrl}/rest/v1/${table}?${params.toString()}`;

  const res = await fetch(url, {
    method: 'HEAD',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Accept-Profile': schema,
      Prefer: 'count=exact',
      Range: '0-0',
    },
    signal,
  });

  if (!res.ok) return null;

  // PostgREST returns count in Content-Range header: "0-0/42" or "*/0"
  const range = res.headers.get('content-range');
  if (!range) return null;

  const match = range.match(/\/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Query WAU: count(distinct user_id) from auth.sessions in last 7 days.
 * Uses a GET with select=user_id and distinct, then counts unique.
 * Falls back to 0 silently if auth.sessions doesn't exist.
 */
async function queryWau(
  projectUrl: string,
  serviceKey: string,
  signal?: AbortSignal
): Promise<number | null> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    select: 'user_id',
    created_at: `gte.${sevenDaysAgo}`,
  });

  const url = `${projectUrl}/rest/v1/sessions?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Accept-Profile': 'auth',
      },
      signal,
    });

    if (!res.ok) return 0;

    const rows: { user_id: string }[] = await res.json();
    const uniqueUsers = new Set(rows.map((r) => r.user_id));
    return uniqueUsers.size;
  } catch {
    return 0;
  }
}

export async function getProjectMetrics(
  project: DeployedProject
): Promise<ProjectMetrics> {
  const base: ProjectMetrics = {
    projectId: project.id,
    totalUsers: null,
    newUsers7d: null,
    wau: null,
    error: null,
  };

  if (!project.supabase_project_url || !project.supabase_service_key) {
    return { ...base, error: 'missing credentials' };
  }

  const projectUrl = project.supabase_project_url.replace(/\/$/, '');
  const serviceKey = project.supabase_service_key;
  const signal = AbortSignal.timeout(TIMEOUT_MS);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const [totalUsers, newUsers7d, wau] = await Promise.allSettled([
      queryCount(projectUrl, serviceKey, 'auth', 'users', undefined, signal),
      queryCount(projectUrl, serviceKey, 'auth', 'users', `created_at=gte.${sevenDaysAgo}`, signal),
      queryWau(projectUrl, serviceKey, signal),
    ]);

    if (totalUsers.status === 'fulfilled') base.totalUsers = totalUsers.value;
    if (newUsers7d.status === 'fulfilled') base.newUsers7d = newUsers7d.value;
    if (wau.status === 'fulfilled') base.wau = wau.value;

    return base;
  } catch (e: unknown) {
    return {
      ...base,
      error: e instanceof Error ? e.message : 'unknown error',
    };
  }
}
