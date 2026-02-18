'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import type { Project } from '@/lib/types';

const emptyProject: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
  slug: '',
  tag: '',
  name: '',
  description: '',
  skills: [],
  external_url: null,
  visual_type: 'custom',
  visual_bg_color: null,
  thumbnail_url: null,
  sort_order: 0,
  is_visible: true,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  async function loadProjects() {
    const supabase = createClient();
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    setProjects(data || []);
    setLoading(false);
  }

  function startNew() {
    setEditing({
      ...emptyProject,
      sort_order: projects.length + 1,
      id: '',
      created_at: '',
      updated_at: '',
    } as Project);
    setIsNew(true);
    setDirty(false);
  }

  function startEdit(project: Project) {
    setEditing({ ...project });
    setIsNew(false);
    setDirty(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.name.trim() || !editing.slug.trim()) {
      showToast('Name and slug are required', 'error');
      return;
    }
    setSaving(true);
    const supabase = createClient();

    const payload = {
      slug: editing.slug,
      tag: editing.tag,
      name: editing.name,
      description: editing.description,
      skills: editing.skills,
      external_url: editing.external_url || null,
      visual_type: editing.visual_type,
      visual_bg_color: editing.visual_bg_color || null,
      thumbnail_url: editing.thumbnail_url || null,
      sort_order: editing.sort_order,
      is_visible: editing.is_visible,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from('projects').insert(payload));
    } else {
      ({ error } = await supabase.from('projects').update(payload).eq('id', editing.id));
    }

    setSaving(false);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast(isNew ? 'Project created' : 'Project updated');
      setEditing(null);
      setDirty(false);
      loadProjects();
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Project deleted');
      setDeleteConfirm(null);
      loadProjects();
    }
  }

  async function toggleVisibility(project: Project) {
    const supabase = createClient();
    const { error } = await supabase
      .from('projects')
      .update({ is_visible: !project.is_visible })
      .eq('id', project.id);
    if (error) {
      showToast(error.message, 'error');
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_visible: !p.is_visible } : p))
      );
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length || !editing) return;
    const file = e.target.files[0];
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${editing.slug || 'project'}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('project-images').upload(path, file);
    if (error) {
      showToast('Upload failed: ' + error.message, 'error');
      return;
    }

    const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(path);
    setEditing({ ...editing, thumbnail_url: urlData.publicUrl });
    setDirty(true);
    showToast('Image uploaded');
  }

  if (loading) return <div className="text-ink-muted">Loading...</div>;

  // Edit/Create form
  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">{isNew ? 'New Project' : 'Edit Project'}</h1>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (dirty && !confirm('Discard unsaved changes?')) return;
                setEditing(null);
                setDirty(false);
              }}
              className="px-4 py-2 rounded-lg border border-ink/10 text-sm font-medium hover:bg-bg-alt transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink/[0.06] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Name" value={editing.name} onChange={(v) => { setEditing({ ...editing, name: v }); setDirty(true); }} required />
            <InputField label="Slug" value={editing.slug} onChange={(v) => { setEditing({ ...editing, slug: v }); setDirty(true); }} required />
          </div>
          <InputField label="Tag" value={editing.tag} onChange={(v) => { setEditing({ ...editing, tag: v }); setDirty(true); }} />
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-ink-muted mb-1.5">Description</label>
            <textarea
              value={editing.description}
              onChange={(e) => { setEditing({ ...editing, description: e.target.value }); setDirty(true); }}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-y"
            />
          </div>
          <InputField
            label="Skills (comma separated)"
            value={editing.skills.join(', ')}
            onChange={(v) => { setEditing({ ...editing, skills: v.split(',').map((s) => s.trim()).filter(Boolean) }); setDirty(true); }}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="External URL" value={editing.external_url || ''} onChange={(v) => { setEditing({ ...editing, external_url: v || null }); setDirty(true); }} />
            <div>
              <label className="block text-xs font-medium tracking-wider uppercase text-ink-muted mb-1.5">Visual Type</label>
              <select
                value={editing.visual_type}
                onChange={(e) => { setEditing({ ...editing, visual_type: e.target.value as Project['visual_type'] }); setDirty(true); }}
                className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
              >
                {['rebrand', 'card', 'marketplace', 'brand-system', 'historia', 'duhbate', 'custom'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Visual BG Color" value={editing.visual_bg_color || ''} onChange={(v) => { setEditing({ ...editing, visual_bg_color: v || null }); setDirty(true); }} />
            <InputField
              label="Sort Order"
              value={String(editing.sort_order)}
              onChange={(v) => { setEditing({ ...editing, sort_order: parseInt(v) || 0 }); setDirty(true); }}
            />
          </div>

          {editing.visual_type === 'custom' && (
            <div>
              <label className="block text-xs font-medium tracking-wider uppercase text-ink-muted mb-1.5">
                Thumbnail Image
              </label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
              {editing.thumbnail_url && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editing.thumbnail_url} alt="Preview" className="h-24 rounded-lg object-cover" />
                </div>
              )}
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editing.is_visible}
              onChange={(e) => { setEditing({ ...editing, is_visible: e.target.checked }); setDirty(true); }}
              className="rounded"
            />
            Visible on site
          </label>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-1">Projects</h1>
          <p className="text-sm text-ink-muted">{projects.length} projects</p>
        </div>
        <button
          onClick={startNew}
          className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition"
        >
          + Add Project
        </button>
      </div>

      <div className="bg-white rounded-xl border border-ink/[0.06] overflow-hidden">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between px-5 py-4 border-b border-ink/[0.04] last:border-b-0 hover:bg-bg/50 transition"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="text-sm text-ink-muted w-6 text-center">{project.sort_order}</span>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{project.name}</div>
                <div className="text-xs text-ink-muted truncate">{project.tag}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility(project)}
                className={`px-2 py-1 rounded text-xs ${
                  project.is_visible ? 'bg-green-100 text-green-700' : 'bg-ink/5 text-ink-muted'
                }`}
              >
                {project.is_visible ? 'Visible' : 'Hidden'}
              </button>
              <button
                onClick={() => startEdit(project)}
                className="px-3 py-1 rounded text-xs font-medium bg-bg-alt hover:bg-ink/10 transition"
              >
                Edit
              </button>
              {deleteConfirm === project.id ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-2 py-1 rounded text-xs bg-red-600 text-white"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-2 py-1 rounded text-xs bg-bg-alt"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(project.id)}
                  className="px-2 py-1 rounded text-xs text-red-600 hover:bg-red-50 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="p-8 text-center text-ink-muted text-sm">No projects yet. Add your first one.</div>
        )}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium tracking-wider uppercase text-ink-muted mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
      />
    </div>
  );
}
