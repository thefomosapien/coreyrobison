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

  try {
    const client = createClient(projectUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const metricsPromise = (async () => {
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

        if (data.users.length < perPage) break;
        page++;
      }

      const totalUsers = allUsers.length;
      const newUsers7d = allUsers.filter((u) => u.created_at >= sevenDaysAgo).length;
      const wau = allUsers.filter(
        (u) => u.last_sign_in_at && u.last_sign_in_at >= sevenDaysAgo
      ).length;

      return { totalUsers, newUsers7d, wau };
    })();

    const result = await Promise.race([
      metricsPromise,
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
