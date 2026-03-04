import { createServerSupabaseClient } from '@/lib/supabase/server';
import ProjectsDashboard from '@/components/admin/ProjectsDashboard';
import type { DeployedProject } from '@/lib/types';

export const metadata = {
  title: 'Projects Dashboard — Admin',
};

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

  return <ProjectsDashboard projects={projects} />;
}
