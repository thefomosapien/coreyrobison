'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { DeployedProject, ProjectMetrics } from '@/lib/types';
import CredentialRow from './CredentialRow';

type Tab = 'metrics' | 'credentials' | 'notes';

function formatMetric(n: number | null | undefined): string {
  if (n == null) return '\u2014';
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  healthy: { bg: 'rgba(61,110,92,0.1)', text: '#3D6E5C', dot: '#3D6E5C' },
  warning: { bg: 'rgba(198,140,90,0.1)', text: '#C68C5A', dot: '#C68C5A' },
  paused: { bg: 'rgba(160,154,146,0.1)', text: '#A09A92', dot: '#A09A92' },
  error: { bg: 'rgba(220,60,60,0.1)', text: '#dc3c3c', dot: '#dc3c3c' },
};

function getSupabaseRef(projectUrl: string | null): string | null {
  if (!projectUrl) return null;
  try {
    return new URL(projectUrl).hostname.split('.')[0];
  } catch {
    return null;
  }
}

export default function ProjectCard({
  project,
  metrics,
  onRefresh,
}: {
  project: DeployedProject;
  metrics: ProjectMetrics | null;
  onRefresh: () => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('metrics');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES.healthy;
  const projectRef = getSupabaseRef(project.supabase_project_url);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);

    const supabase = createClient();
    const { error } = await supabase
      .from('deployed_projects')
      .update({
        name: fd.get('name') as string,
        description: (fd.get('description') as string) || null,
        url: (fd.get('url') as string) || null,
        github_url: (fd.get('github_url') as string) || null,
        status: (fd.get('status') as string) || 'healthy',
        color_hex: (fd.get('color_hex') as string) || null,
        supabase_account_email: (fd.get('supabase_account_email') as string) || null,
        supabase_project_url: (fd.get('supabase_project_url') as string) || null,
        supabase_anon_key: (fd.get('supabase_anon_key') as string) || null,
        supabase_service_key: (fd.get('supabase_service_key') as string) || null,
        notes: (fd.get('notes') as string) || null,
        sort_order: parseInt(fd.get('sort_order') as string) || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', project.id);

    setSaving(false);
    if (error) {
      alert(error.message);
    } else {
      setEditing(false);
      await onRefresh();
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    const supabase = createClient();
    const { error } = await supabase.from('deployed_projects').delete().eq('id', project.id);
    if (error) {
      alert(error.message);
    } else {
      await onRefresh();
    }
  };

  return (
    <div
      className="rounded-xl border overflow-hidden transition-shadow"
      style={{
        borderColor: 'rgba(42,40,36,0.08)',
        backgroundColor: project.color_hex
          ? `color-mix(in srgb, ${project.color_hex} 7%, #FDFCF9)`
          : '#FDFCF9',
      }}
    >
      {/* Collapsed Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-center gap-4"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3
              className="font-serif text-lg"
              style={{ color: project.color_hex || '#2A2824' }}
            >
              {project.name}
            </h3>
            <span
              className="inline-flex items-center gap-1.5 font-pixel text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${project.status === 'healthy' ? 'animate-pulse-dot' : ''}`}
                style={{ backgroundColor: statusStyle.dot }}
              />
              {project.status}
            </span>
          </div>
          <p className="text-sm text-ink-light truncate">{project.description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-pixel text-[8px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border text-ink-muted hover:text-ocean hover:border-ocean/30 transition-colors"
              style={{ borderColor: 'rgba(42,40,36,0.08)' }}
            >
              site &#8599;
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-pixel text-[8px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border text-ink-muted hover:text-ocean hover:border-ocean/30 transition-colors"
              style={{ borderColor: 'rgba(42,40,36,0.08)' }}
            >
              gh &#8599;
            </a>
          )}
          <span className="text-ink-ghost text-sm ml-1">
            {expanded ? '\u25B2' : '\u25BC'}
          </span>
        </div>
      </button>

      {/* Quick Metrics Row */}
      <div
        className="grid grid-cols-4 border-t mx-5"
        style={{ borderColor: 'rgba(42,40,36,0.06)' }}
      >
        {metrics?.error ? (
          <div className="col-span-4 py-2.5 text-center">
            <span
              className="inline-block font-pixel text-[8px] uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(198,140,90,0.12)', color: '#C68C5A' }}
            >
              can&apos;t reach db
            </span>
          </div>
        ) : (
          <>
            <QuickMetricCell label="Total Users" value={formatMetric(metrics?.totalUsers)} />
            <QuickMetricCell label="New 7d" value={formatMetric(metrics?.newUsers7d)} />
            <QuickMetricCell label="Weekly Active" value={formatMetric(metrics?.wau)} />
            <QuickMetricCell label="Uptime" value="\u2014" />
          </>
        )}
      </div>

      {/* Expanded Panel */}
      {expanded && (
        <div className="border-t px-5 py-4" style={{ borderColor: 'rgba(42,40,36,0.06)' }}>
          {editing ? (
            <EditForm project={project} onCancel={() => setEditing(false)} onSubmit={handleUpdate} onDelete={handleDelete} isPending={saving} />
          ) : (
            <>
              {/* Tab Bar */}
              <div className="flex items-center gap-4 mb-4">
                {(['metrics', 'credentials', 'notes'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="font-pixel text-[9px] uppercase tracking-wider pb-1.5 transition-colors"
                    style={{
                      color: activeTab === tab ? '#5A8A9A' : '#A09A92',
                      borderBottom: activeTab === tab ? '2px solid #5A8A9A' : '2px solid transparent',
                    }}
                  >
                    {tab}
                  </button>
                ))}
                <div className="flex-1" />
                <button
                  onClick={() => setEditing(true)}
                  className="font-pixel text-[8px] uppercase tracking-wider px-2.5 py-1 rounded text-ink-muted hover:text-ocean transition-colors"
                >
                  edit
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'metrics' && <MetricsTab metrics={metrics} />}
              {activeTab === 'credentials' && <CredentialsTab project={project} projectRef={projectRef} />}
              {activeTab === 'notes' && <NotesTab notes={project.notes} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function QuickMetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2.5 text-center">
      <div className="font-pixel text-[7px] uppercase tracking-wider text-ink-faint mb-0.5">
        {label}
      </div>
      <div className="font-serif text-sm text-ink-muted">{value}</div>
    </div>
  );
}

function MetricsTab({ metrics }: { metrics: ProjectMetrics | null }) {
  if (metrics?.error) {
    return (
      <div
        className="rounded-lg p-4 border text-center"
        style={{ borderColor: 'rgba(198,140,90,0.15)', backgroundColor: 'rgba(198,140,90,0.05)' }}
      >
        <span
          className="inline-block font-pixel text-[8px] uppercase tracking-wider px-2.5 py-1 rounded-full mb-2"
          style={{ backgroundColor: 'rgba(198,140,90,0.12)', color: '#C68C5A' }}
        >
          can&apos;t reach db
        </span>
        <p className="text-xs text-ink-ghost">{metrics.error}</p>
      </div>
    );
  }

  const wauPercent =
    metrics?.wau != null && metrics?.totalUsers != null && metrics.totalUsers > 0
      ? Math.round((metrics.wau / metrics.totalUsers) * 100)
      : null;

  const newUsersSubtext =
    metrics?.newUsers7d != null
      ? metrics.newUsers7d > 0
        ? '\u2191 trending'
        : 'quiet week'
      : '';

  const metricsData = [
    {
      label: 'Total Users',
      value: formatMetric(metrics?.totalUsers),
      note: 'all time',
    },
    {
      label: 'New Signups',
      value: formatMetric(metrics?.newUsers7d),
      note: newUsersSubtext || 'last 7 days',
    },
    {
      label: 'Weekly Active',
      value: formatMetric(metrics?.wau),
      note: wauPercent != null ? `${wauPercent}% of total` : 'unique sessions',
    },
    {
      label: 'Site Uptime',
      value: '\u2014',
      note: 'coming soon',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {metricsData.map((m) => (
          <div
            key={m.label}
            className="rounded-lg p-4 border"
            style={{ borderColor: 'rgba(42,40,36,0.06)', backgroundColor: 'rgba(253,252,249,0.7)' }}
          >
            <div className="font-pixel text-[8px] uppercase tracking-wider text-ink-faint mb-1">
              {m.label}
            </div>
            <div className="font-serif text-2xl text-ink-muted">{m.value}</div>
            <div className="text-[11px] text-ink-ghost mt-0.5">{m.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CredentialsTab({ project, projectRef }: { project: DeployedProject; projectRef: string | null }) {
  return (
    <div>
      <div
        className="rounded-lg p-4 border font-mono"
        style={{ borderColor: 'rgba(42,40,36,0.06)', backgroundColor: 'rgba(253,252,249,0.7)' }}
      >
        <CredentialRow label="account" value={project.supabase_account_email} />
        <CredentialRow label="project url" value={project.supabase_project_url} />
        <CredentialRow label="anon key" value={project.supabase_anon_key} />
        <CredentialRow label="service key" value={project.supabase_service_key} />
      </div>
      {projectRef && (
        <a
          href={`https://supabase.com/dashboard/project/${projectRef}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 font-pixel text-[9px] uppercase tracking-wider px-3 py-2 rounded-lg border text-ink-muted hover:text-ocean hover:border-ocean/30 transition-colors"
          style={{ borderColor: 'rgba(42,40,36,0.08)' }}
        >
          open supabase dashboard &#8599;
        </a>
      )}
    </div>
  );
}

function NotesTab({ notes }: { notes: string | null }) {
  return (
    <div
      className="rounded-lg p-4 border"
      style={{
        borderColor: 'rgba(198,140,90,0.15)',
        backgroundColor: 'rgba(198,140,90,0.05)',
      }}
    >
      {notes ? (
        <p className="text-sm text-ink-light leading-relaxed">{notes}</p>
      ) : (
        <p className="text-sm text-ink-ghost italic">No notes for this project.</p>
      )}
    </div>
  );
}

function EditForm({
  project,
  onCancel,
  onSubmit,
  onDelete,
  isPending,
}: {
  project: DeployedProject;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Name" name="name" defaultValue={project.name} required />
          <FormField label="URL" name="url" defaultValue={project.url || ''} />
        </div>
        <FormField label="Description" name="description" defaultValue={project.description || ''} />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="GitHub URL" name="github_url" defaultValue={project.github_url || ''} />
          <div>
            <label className="block font-pixel text-[8px] uppercase tracking-wider text-ink-faint mb-1">
              Status
            </label>
            <select
              name="status"
              defaultValue={project.status}
              className="w-full px-3 py-2 rounded-lg border text-sm bg-bg focus:outline-none focus:ring-2 focus:ring-ocean/30 transition"
              style={{ borderColor: 'rgba(42,40,36,0.08)' }}
            >
              <option value="healthy">healthy</option>
              <option value="warning">warning</option>
              <option value="paused">paused</option>
              <option value="error">error</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Color Hex" name="color_hex" defaultValue={project.color_hex || ''} />
          <FormField label="Sort Order" name="sort_order" defaultValue={String(project.sort_order)} type="number" />
        </div>
        <FormField label="Supabase Account Email" name="supabase_account_email" defaultValue={project.supabase_account_email || ''} />
        <FormField label="Supabase Project URL" name="supabase_project_url" defaultValue={project.supabase_project_url || ''} />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Anon Key" name="supabase_anon_key" defaultValue={project.supabase_anon_key || ''} />
          <FormField label="Service Key" name="supabase_service_key" defaultValue={project.supabase_service_key || ''} />
        </div>
        <div>
          <label className="block font-pixel text-[8px] uppercase tracking-wider text-ink-faint mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            defaultValue={project.notes || ''}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border text-sm bg-bg focus:outline-none focus:ring-2 focus:ring-ocean/30 transition resize-y"
            style={{ borderColor: 'rgba(42,40,36,0.08)' }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: 'rgba(42,40,36,0.06)' }}>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          Delete project
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg border text-sm text-ink-muted hover:text-ink transition-colors"
            style={{ borderColor: 'rgba(42,40,36,0.08)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-1.5 rounded-lg bg-ink text-white text-sm hover:bg-ink/90 transition disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
}

function FormField({
  label,
  name,
  defaultValue,
  required = false,
  type = 'text',
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block font-pixel text-[8px] uppercase tracking-wider text-ink-faint mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full px-3 py-2 rounded-lg border text-sm bg-bg focus:outline-none focus:ring-2 focus:ring-ocean/30 transition"
        style={{ borderColor: 'rgba(42,40,36,0.08)' }}
      />
    </div>
  );
}
