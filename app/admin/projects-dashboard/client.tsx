'use client';

import { useRouter } from 'next/navigation';
import type { DeployedProject, ProjectMetrics } from '@/lib/types';
import ProjectsDashboard from '@/components/admin/ProjectsDashboard';

export default function ProjectsDashboardClient({
  initialProjects,
  initialMetrics,
}: {
  initialProjects: DeployedProject[];
  initialMetrics: Record<string, ProjectMetrics>;
}) {
  const router = useRouter();

  const handleRefresh = async () => {
    // Re-run the server component to get fresh data + metrics
    router.refresh();
  };

  return (
    <ProjectsDashboard
      projects={initialProjects}
      metrics={initialMetrics}
      onRefresh={handleRefresh}
    />
  );
}
