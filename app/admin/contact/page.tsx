'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import type { ContactLink } from '@/lib/types';

const emptyLink: Omit<ContactLink, 'id'> = {
  label: '',
  url: '',
  is_email: false,
  sort_order: 0,
};

export default function ContactPage() {
  const [links, setLinks] = useState<ContactLink[]>([]);
  const [editing, setEditing] = useState<ContactLink | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => { loadLinks(); }, []);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  async function loadLinks() {
    const supabase = createClient();
    const { data } = await supabase.from('contact_links').select('*').order('sort_order');
    setLinks(data || []);
    setLoading(false);
  }

  function startNew() {
    setEditing({ ...emptyLink, sort_order: links.length + 1, id: '' } as ContactLink);
    setIsNew(true); setDirty(false);
  }

  function startEdit(link: ContactLink) {
    setEditing({ ...link }); setIsNew(false); setDirty(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.label.trim() || !editing.url.trim()) { showToast('Label and URL are required', 'error'); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = { label: editing.label, url: editing.url, is_email: editing.is_email, sort_order: editing.sort_order };
    const { error } = isNew
      ? await supabase.from('contact_links').insert(payload)
      : await supabase.from('contact_links').update(payload).eq('id', editing.id);
    setSaving(false);
    if (error) showToast(error.message, 'error');
    else { showToast(isNew ? 'Link created' : 'Link updated'); setEditing(null); setDirty(false); loadLinks(); }
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('contact_links').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Link deleted'); setDeleteConfirm(null); loadLinks(); }
  }

  if (loading) return <div className="text-ink-muted">Loading...</div>;

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">{isNew ? 'New Contact Link' : 'Edit Contact Link'}</h1>
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
          <Field label="URL" value={editing.url} onChange={v => { setEditing({ ...editing, url: v }); setDirty(true); }} required />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editing.is_email} onChange={e => { setEditing({ ...editing, is_email: e.target.checked }); setDirty(true); }} className="rounded" />
            This is the primary email (styled differently in footer)
          </label>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-1">Contact Links</h1>
          <p className="text-sm text-ink-muted">{links.length} links</p>
        </div>
        <button onClick={startNew} className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition">+ Add Link</button>
      </div>
      <div className="bg-white rounded-xl border border-ink/[0.06] overflow-hidden">
        {links.map(link => (
          <div key={link.id} className="flex items-center justify-between px-5 py-4 border-b border-ink/[0.04] last:border-b-0 hover:bg-bg/50 transition">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="text-sm text-ink-muted w-6 text-center">{link.sort_order}</span>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">
                  {link.label}
                  {link.is_email && <span className="ml-2 text-[0.65rem] bg-accent/10 text-accent px-1.5 py-0.5 rounded">Email</span>}
                </div>
                <div className="text-xs text-ink-muted truncate">{link.url}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(link)} className="px-3 py-1 rounded text-xs font-medium bg-bg-alt hover:bg-ink/10 transition">Edit</button>
              {deleteConfirm === link.id ? (
                <div className="flex gap-1">
                  <button onClick={() => handleDelete(link.id)} className="px-2 py-1 rounded text-xs bg-red-600 text-white">Confirm</button>
                  <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded text-xs bg-bg-alt">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(link.id)} className="px-2 py-1 rounded text-xs text-red-600 hover:bg-red-50 transition">Delete</button>
              )}
            </div>
          </div>
        ))}
        {links.length === 0 && <div className="p-8 text-center text-ink-muted text-sm">No contact links yet.</div>}
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
