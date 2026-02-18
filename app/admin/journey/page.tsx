'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import type { JourneyItem } from '@/lib/types';

const emptyItem: Omit<JourneyItem, 'id'> = {
  year_label: '',
  role: '',
  company: '',
  note: '',
  sort_order: 0,
  is_visible: true,
};

export default function JourneyPage() {
  const [items, setItems] = useState<JourneyItem[]>([]);
  const [editing, setEditing] = useState<JourneyItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => { loadItems(); }, []);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  async function loadItems() {
    const supabase = createClient();
    const { data } = await supabase.from('journey_items').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  }

  function startNew() {
    setEditing({ ...emptyItem, sort_order: items.length + 1, id: '' } as JourneyItem);
    setIsNew(true); setDirty(false);
  }

  function startEdit(item: JourneyItem) {
    setEditing({ ...item }); setIsNew(false); setDirty(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.role.trim()) { showToast('Role is required', 'error'); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      year_label: editing.year_label,
      role: editing.role,
      company: editing.company,
      note: editing.note,
      sort_order: editing.sort_order,
      is_visible: editing.is_visible,
    };
    const { error } = isNew
      ? await supabase.from('journey_items').insert(payload)
      : await supabase.from('journey_items').update(payload).eq('id', editing.id);
    setSaving(false);
    if (error) { showToast(error.message, 'error'); }
    else { showToast(isNew ? 'Item created' : 'Item updated'); setEditing(null); setDirty(false); loadItems(); }
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('journey_items').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Item deleted'); setDeleteConfirm(null); loadItems(); }
  }

  async function toggleVisibility(item: JourneyItem) {
    const supabase = createClient();
    const { error } = await supabase.from('journey_items').update({ is_visible: !item.is_visible }).eq('id', item.id);
    if (error) showToast(error.message, 'error');
    else setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_visible: !i.is_visible } : i));
  }

  if (loading) return <div className="text-ink-muted">Loading...</div>;

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">{isNew ? 'New Journey Item' : 'Edit Journey Item'}</h1>
          <div className="flex gap-3">
            <button onClick={() => { if (dirty && !confirm('Discard unsaved changes?')) return; setEditing(null); setDirty(false); }} className="px-4 py-2 rounded-lg border border-ink/10 text-sm font-medium hover:bg-bg-alt transition">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-ink/[0.06] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Year Label" value={editing.year_label} onChange={v => { setEditing({ ...editing, year_label: v }); setDirty(true); }} />
            <Field label="Sort Order" value={String(editing.sort_order)} onChange={v => { setEditing({ ...editing, sort_order: parseInt(v) || 0 }); setDirty(true); }} />
          </div>
          <Field label="Role" value={editing.role} onChange={v => { setEditing({ ...editing, role: v }); setDirty(true); }} required />
          <Field label="Company" value={editing.company} onChange={v => { setEditing({ ...editing, company: v }); setDirty(true); }} />
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-ink-muted mb-1.5">Note</label>
            <textarea value={editing.note} onChange={e => { setEditing({ ...editing, note: e.target.value }); setDirty(true); }} rows={3} className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-y" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editing.is_visible} onChange={e => { setEditing({ ...editing, is_visible: e.target.checked }); setDirty(true); }} className="rounded" />
            Visible on site
          </label>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-1">Journey</h1>
          <p className="text-sm text-ink-muted">{items.length} items</p>
        </div>
        <button onClick={startNew} className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition">+ Add Item</button>
      </div>
      <div className="bg-white rounded-xl border border-ink/[0.06] overflow-hidden">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between px-5 py-4 border-b border-ink/[0.04] last:border-b-0 hover:bg-bg/50 transition">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="text-sm text-ink-muted w-6 text-center">{item.sort_order}</span>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{item.role}</div>
                <div className="text-xs text-ink-muted truncate">{item.year_label} · {item.company}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleVisibility(item)} className={`px-2 py-1 rounded text-xs ${item.is_visible ? 'bg-green-100 text-green-700' : 'bg-ink/5 text-ink-muted'}`}>{item.is_visible ? 'Visible' : 'Hidden'}</button>
              <button onClick={() => startEdit(item)} className="px-3 py-1 rounded text-xs font-medium bg-bg-alt hover:bg-ink/10 transition">Edit</button>
              {deleteConfirm === item.id ? (
                <div className="flex gap-1">
                  <button onClick={() => handleDelete(item.id)} className="px-2 py-1 rounded text-xs bg-red-600 text-white">Confirm</button>
                  <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded text-xs bg-bg-alt">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(item.id)} className="px-2 py-1 rounded text-xs text-red-600 hover:bg-red-50 transition">Delete</button>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="p-8 text-center text-ink-muted text-sm">No journey items yet.</div>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required = false }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium tracking-wider uppercase text-ink-muted mb-1.5">{label} {required && <span className="text-accent">*</span>}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} required={required} className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition" />
    </div>
  );
}
