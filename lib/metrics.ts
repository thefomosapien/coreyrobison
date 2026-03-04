import { createClient } from '@supabase/supabase-js';
import type { DeployedProject, ProjectMetrics } from './types';

const TIMEOUT_MS = 5000;

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

  let client;
  try {
    client = createClient(projectUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch (e: unknown) {
    return { ...base, error: `client init failed: ${e instanceof Error ? e.message : String(e)}` };
  }

  try {
    const result = await Promise.race([
      fetchUserMetrics(client),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
      ),
    ]);

    return { ...base, ...result };
  } catch (e: unknown) {
    return {
      ...base,
      error: e instanceof Error ? e.message : 'unknown error',
    };
  }
}

async function fetchUserMetrics(
  client: ReturnType<typeof createClient>
): Promise<{ totalUsers: number | null; newUsers7d: number | null; wau: number | null }> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Use the auth admin API — this is the only way to access auth.users
  // via supabase-js since PostgREST doesn't expose the auth schema.
  // Fetch up to 1000 users per page and paginate if needed.
  let allUsers: { created_at: string; last_sign_in_at: string | null }[] = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage });

    if (error) {
      return { totalUsers: null, newUsers7d: null, wau: null };
    }

    allUsers = allUsers.concat(
      data.users.map((u) => ({
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
      }))
    );

    // If we got fewer than perPage, we've fetched all users
    if (data.users.length < perPage) break;
    page++;
  }

  const totalUsers = allUsers.length;
  const newUsers7d = allUsers.filter((u) => u.created_at >= sevenDaysAgo).length;

  // WAU: count users who signed in within the last 7 days
  const wau = allUsers.filter(
    (u) => u.last_sign_in_at && u.last_sign_in_at >= sevenDaysAgo
  ).length;

  return { totalUsers, newUsers7d, wau };
}
