'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { DeployedProject } from '@/lib/types';
import ProjectCard from './ProjectCard';

export default function ProjectsDashboard({
  projects,
  onRefresh,
}: {
  projects: DeployedProject[];
  onRefresh: () => Promise<void>;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalCount = projects.length;
  const healthyCount = projects.filter((p) => p.status === 'healthy').length;
  const alertCount = projects.filter((p) => p.status !== 'healthy').length;

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget;
    const fd = new FormData(form);

    const supabase = createClient();
    const { error } = await supabase.from('deployed_projects').insert({
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
    });

    setSaving(false);
    if (error) {
      alert(error.message);
    } else {
      setShowAddForm(false);
      await onRefresh();
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-1">Projects Command Center</h1>
          <p className="text-sm text-ink-light">Monitor deployed apps, credentials, and health status</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition"
        >
          {showAddForm ? 'Cancel' : '+ Add Project'}
        </button>
      </div>

      {/* Add Form (slide-down) */}
      {showAddForm && (
        <div
          className="rounded-xl border p-6 mb-6"
          style={{ borderColor: 'rgba(42,40,36,0.08)', backgroundColor: '#FDFCF9' }}
        >
          <h2 className="font-serif text-lg mb-4">New Deployed Project</h2>
          <AddForm onSubmit={handleAdd} isPending={saving} />
        </div>
      )}

      {/* Summary Bar */}
      <div
        className="grid grid-cols-4 rounded-xl overflow-hidden mb-8"
        style={{ backgroundColor: 'rgba(42,40,36,0.06)', gap: '1px' }}
      >
        <SummaryCell
          label="Projects"
          value={String(totalCount)}
          subtext={`${healthyCount} healthy`}
        />
        <SummaryCell
          label="Total Users"
          value="\u2014"
          subtext="connect metrics to populate"
        />
        <SummaryCell
          label="New / 7d"
          value="\u2014"
          subtext="connect metrics to populate"
        />
        <SummaryCell
          label="Alerts"
          value={String(alertCount)}
          subtext={alertCount > 0 ? `${alertCount} need attention` : 'all systems go'}
          accent={alertCount > 0 ? '#C68C5A' : '#3D6E5C'}
        />
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onRefresh={onRefresh} />
        ))}
        {projects.length === 0 && (
          <div
            className="rounded-xl border p-12 text-center"
            style={{ borderColor: 'rgba(42,40,36,0.08)', backgroundColor: '#FDFCF9' }}
          >
            <p className="text-ink-muted text-sm">No deployed projects yet. Add your first one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCell({
  label,
  value,
  subtext,
  accent,
}: {
  label: string;
  value: string;
  subtext: string;
  accent?: string;
}) {
  return (
    <div className="py-4 px-5" style={{ backgroundColor: '#FDFCF9' }}>
      <div className="font-pixel text-[8px] uppercase tracking-wider text-ink-faint mb-1.5">
        {label}
      </div>
      <div
        className="font-serif text-2xl mb-0.5"
        style={{ color: accent || '#2A2824' }}
      >
        {value}
      </div>
      <div className="text-[11px] text-ink-ghost">{subtext}</div>
    </div>
  );
}

function AddForm({ onSubmit, isPending }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; isPending: boolean }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Name" name="name" required />
          <FormField label="URL" name="url" />
        </div>
        <FormField label="Description" name="description" />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="GitHub URL" name="github_url" />
          <div>
            <label className="block font-pixel text-[8px] uppercase tracking-wider text-ink-faint mb-1">
              Status
            </label>
            <select
              name="status"
              defaultValue="healthy"
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
          <FormField label="Color Hex" name="color_hex" placeholder="#3D6E5C" />
          <FormField label="Sort Order" name="sort_order" defaultValue="0" type="number" />
        </div>
        <FormField label="Supabase Account Email" name="supabase_account_email" />
        <FormField label="Supabase Project URL" name="supabase_project_url" />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Anon Key" name="supabase_anon_key" />
          <FormField label="Service Key" name="supabase_service_key" />
        </div>
        <div>
          <label className="block font-pixel text-[8px] uppercase tracking-wider text-ink-faint mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border text-sm bg-bg focus:outline-none focus:ring-2 focus:ring-ocean/30 transition resize-y"
            style={{ borderColor: 'rgba(42,40,36,0.08)' }}
          />
        </div>
      </div>
      <div className="flex justify-end mt-4 pt-3 border-t" style={{ borderColor: 'rgba(42,40,36,0.06)' }}>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition disabled:opacity-50"
        >
          {isPending ? 'Adding...' : 'Add Project'}
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  name,
  defaultValue = '',
  required = false,
  type = 'text',
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border text-sm bg-bg focus:outline-none focus:ring-2 focus:ring-ocean/30 transition"
        style={{ borderColor: 'rgba(42,40,36,0.08)' }}
      />
    </div>
  );
}
