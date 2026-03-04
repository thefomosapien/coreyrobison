import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getProjectMetrics } from '@/lib/metrics';
import type { DeployedProject, ProjectMetrics } from '@/lib/types';
import ProjectsDashboardClient from './client';

export const dynamic = 'force-dynamic';

export default async function ProjectsDashboardPage() {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return <div className="text-ink-muted">Supabase not configured.</div>;
  }

  const { data, error } = await supabase
    .from('deployed_projects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return <div className="text-ink-muted">Failed to load projects: {error.message}</div>;
  }

  const projects = (data || []) as DeployedProject[];

  // Fetch metrics for all projects in parallel
  const metricsResults = await Promise.allSettled(
    projects.map((p) => getProjectMetrics(p))
  );

  const metricsMap: Record<string, ProjectMetrics> = {};
  metricsResults.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      metricsMap[projects[i].id] = result.value;
    } else {
      metricsMap[projects[i].id] = {
        projectId: projects[i].id,
        totalUsers: null,
        newUsers7d: null,
        wau: null,
        error: 'failed to fetch metrics',
      };
    }
  });

  return (
    <ProjectsDashboardClient
      initialProjects={projects}
      initialMetrics={metricsMap}
    />
  );
}
