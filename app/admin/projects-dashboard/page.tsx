'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { DeployedProject } from '@/lib/types';
import ProjectsDashboard from '@/components/admin/ProjectsDashboard';

export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState<DeployedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('deployed_projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setProjects((data || []) as DeployedProject[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) return <div className="text-ink-muted">Loading...</div>;
  if (error) return <div className="text-ink-muted">Failed to load projects: {error}</div>;

  return <ProjectsDashboard projects={projects} onRefresh={loadProjects} />;
}
