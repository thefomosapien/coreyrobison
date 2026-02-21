'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import type { Thought } from '@/lib/types';

const emptyThought: Omit<Thought, 'id' | 'created_at' | 'updated_at'> = {
  slug: '',
  title: '',
  category: '',
  body: '',
  excerpt: '',
  is_published: false,
  sort_order: 0,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [editing, setEditing] = useState<Thought | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadThoughts();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  async function loadThoughts() {
    const supabase = createClient();
    const { data } = await supabase.from('thoughts').select('*').order('sort_order');
    setThoughts(data || []);
    setLoading(false);
  }

  function startNew() {
    setEditing({
      ...emptyThought,
      sort_order: thoughts.length + 1,
      id: '',
      created_at: '',
      updated_at: '',
    } as Thought);
    setIsNew(true);
    setDirty(false);
  }

  function startEdit(thought: Thought) {
    setEditing({ ...thought });
    setIsNew(false);
    setDirty(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.title.trim() || !editing.slug.trim()) {
      showToast('Title and slug are required', 'error');
      return;
    }
    setSaving(true);
    const supabase = createClient();

    const payload = {
      slug: editing.slug,
      title: editing.title,
      category: editing.category,
      body: editing.body || null,
      excerpt: editing.excerpt || null,
      is_published: editing.is_published,
      sort_order: editing.sort_order,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from('thoughts').insert(payload));
    } else {
      ({ error } = await supabase.from('thoughts').update(payload).eq('id', editing.id));
    }

    setSaving(false);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast(isNew ? 'Thought created' : 'Thought updated');
      setEditing(null);
      setDirty(false);
      loadThoughts();
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('thoughts').delete().eq('id', id);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Thought deleted');
      setDeleteConfirm(null);
      loadThoughts();
    }
  }

  async function togglePublished(thought: Thought) {
    const supabase = createClient();
    const { error } = await supabase
      .from('thoughts')
      .update({ is_published: !thought.is_published })
      .eq('id', thought.id);
    if (error) {
      showToast(error.message, 'error');
    } else {
      setThoughts((prev) =>
        prev.map((t) => (t.id === thought.id ? { ...t, is_published: !t.is_published } : t))
      );
    }
  }

  if (loading) return <div className="text-ink-muted">Loading...</div>;

  // Edit/Create form
  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">{isNew ? 'New Thought' : 'Edit Thought'}</h1>
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
            <InputField
              label="Title"
              value={editing.title}
              onChange={(v) => {
                const updates: Partial<Thought> = { title: v };
                if (isNew && !dirty) {
                  updates.slug = slugify(v);
                }
                setEditing({ ...editing, ...updates });
                setDirty(true);
              }}
              required
            />
            <InputField
              label="Slug"
              value={editing.slug}
              onChange={(v) => { setEditing({ ...editing, slug: v }); setDirty(true); }}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Category"
              value={editing.category}
              onChange={(v) => { setEditing({ ...editing, category: v }); setDirty(true); }}
            />
            <InputField
              label="Sort Order"
              value={String(editing.sort_order)}
              onChange={(v) => { setEditing({ ...editing, sort_order: parseInt(v) || 0 }); setDirty(true); }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-ink-muted mb-1.5">
              Excerpt
            </label>
            <textarea
              value={editing.excerpt || ''}
              onChange={(e) => { setEditing({ ...editing, excerpt: e.target.value }); setDirty(true); }}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition resize-y"
            />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-ink-muted mb-1.5">
              Body (Markdown)
            </label>
            <textarea
              value={editing.body || ''}
              onChange={(e) => { setEditing({ ...editing, body: e.target.value }); setDirty(true); }}
              rows={12}
              className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-bg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition resize-y"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editing.is_published}
              onChange={(e) => { setEditing({ ...editing, is_published: e.target.checked }); setDirty(true); }}
              className="rounded"
            />
            Published
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
          <h1 className="font-serif text-3xl mb-1">Thoughts</h1>
          <p className="text-sm text-ink-muted">{thoughts.length} thoughts</p>
        </div>
        <button
          onClick={startNew}
          className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition"
        >
          + Add Thought
        </button>
      </div>

      <div className="bg-white rounded-xl border border-ink/[0.06] overflow-hidden">
        {thoughts.map((thought) => (
          <div
            key={thought.id}
            className="flex items-center justify-between px-5 py-4 border-b border-ink/[0.04] last:border-b-0 hover:bg-bg/50 transition"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="text-sm text-ink-muted w-6 text-center">{thought.sort_order}</span>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{thought.title}</div>
                <div className="text-xs text-ink-muted truncate">{thought.category}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => togglePublished(thought)}
                className={`px-2 py-1 rounded text-xs ${
                  thought.is_published ? 'bg-green-100 text-green-700' : 'bg-ink/5 text-ink-muted'
                }`}
              >
                {thought.is_published ? 'Published' : 'Draft'}
              </button>
              <button
                onClick={() => startEdit(thought)}
                className="px-3 py-1 rounded text-xs font-medium bg-bg-alt hover:bg-ink/10 transition"
              >
                Edit
              </button>
              {deleteConfirm === thought.id ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDelete(thought.id)}
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
                  onClick={() => setDeleteConfirm(thought.id)}
                  className="px-2 py-1 rounded text-xs text-red-600 hover:bg-red-50 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        {thoughts.length === 0 && (
          <div className="p-8 text-center text-ink-muted text-sm">No thoughts yet. Add your first one.</div>
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
        {label} {required && <span className="text-ocean">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition"
      />
    </div>
  );
}
