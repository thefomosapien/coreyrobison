'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import type { AboutDetail } from '@/lib/types';

const emptyDetail: Omit<AboutDetail, 'id'> = {
  label: '',
  value: '',
  sort_order: 0,
};

export default function AboutPage() {
  const [details, setDetails] = useState<AboutDetail[]>([]);
  const [editing, setEditing] = useState<AboutDetail | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => { loadDetails(); }, []);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  async function loadDetails() {
    const supabase = createClient();
    const { data } = await supabase.from('about_details').select('*').order('sort_order');
    setDetails(data || []);
    setLoading(false);
  }

  function startNew() {
    setEditing({ ...emptyDetail, sort_order: details.length + 1, id: '' } as AboutDetail);
    setIsNew(true); setDirty(false);
  }

  function startEdit(detail: AboutDetail) {
    setEditing({ ...detail }); setIsNew(false); setDirty(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.label.trim()) { showToast('Label is required', 'error'); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = { label: editing.label, value: editing.value, sort_order: editing.sort_order };
    const { error } = isNew
      ? await supabase.from('about_details').insert(payload)
      : await supabase.from('about_details').update(payload).eq('id', editing.id);
    setSaving(false);
    if (error) showToast(error.message, 'error');
    else { showToast(isNew ? 'Detail created' : 'Detail updated'); setEditing(null); setDirty(false); loadDetails(); }
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('about_details').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Detail deleted'); setDeleteConfirm(null); loadDetails(); }
  }

  if (loading) return <div className="text-ink-muted">Loading...</div>;

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">{isNew ? 'New About Detail' : 'Edit About Detail'}</h1>
          <div className="flex gap-3">
            <button onClick={() => { if (dirty && !confirm('Discard unsaved changes?')) return; setEditing(null); setDirty(false); }} className="px-4 py-2 rounded-lg border border-ink/10 text-sm font-medium hover:bg-bg-alt transition">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-ink/[0.06] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Label" value={editing.label} onChange={v => { setEditing({ ...editing, label: v }); setDirty(true); }} required />
            <Field label="Sort Order" value={String(editing.sort_order)} onChange={v => { setEditing({ ...editing, sort_order: parseInt(v) || 0 }); setDirty(true); }} />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-ink-muted mb-1.5">Value</label>
            <textarea value={editing.value} onChange={e => { setEditing({ ...editing, value: e.target.value }); setDirty(true); }} rows={4} className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-y" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-1">About Details</h1>
          <p className="text-sm text-ink-muted">{details.length} details</p>
        </div>
        <button onClick={startNew} className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition">+ Add Detail</button>
      </div>
      <div className="bg-white rounded-xl border border-ink/[0.06] overflow-hidden">
        {details.map(detail => (
          <div key={detail.id} className="flex items-center justify-between px-5 py-4 border-b border-ink/[0.04] last:border-b-0 hover:bg-bg/50 transition">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="text-sm text-ink-muted w-6 text-center">{detail.sort_order}</span>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{detail.label}</div>
                <div className="text-xs text-ink-muted truncate">{detail.value.substring(0, 80)}...</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(detail)} className="px-3 py-1 rounded text-xs font-medium bg-bg-alt hover:bg-ink/10 transition">Edit</button>
              {deleteConfirm === detail.id ? (
                <div className="flex gap-1">
                  <button onClick={() => handleDelete(detail.id)} className="px-2 py-1 rounded text-xs bg-red-600 text-white">Confirm</button>
                  <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded text-xs bg-bg-alt">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(detail.id)} className="px-2 py-1 rounded text-xs text-red-600 hover:bg-red-50 transition">Delete</button>
              )}
            </div>
          </div>
        ))}
        {details.length === 0 && <div className="p-8 text-center text-ink-muted text-sm">No about details yet.</div>}
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
