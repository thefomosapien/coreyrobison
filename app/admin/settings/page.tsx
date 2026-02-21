'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import type { SiteSettings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('site_settings').select('*').single();
      if (data) setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  // Warn before navigating away with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  const updateField = useCallback((field: keyof SiteSettings, value: string | string[] | null) => {
    setSettings((prev) => prev ? { ...prev, [field]: value } : prev);
    setDirty(true);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('site_settings')
      .update({
        name: settings.name,
        title: settings.title,
        headline: settings.headline,
        company_badge_text: settings.company_badge_text,
        company_badge_url: settings.company_badge_url,
        bio_paragraphs: settings.bio_paragraphs,
        photo_url: settings.photo_url,
        about_headline: settings.about_headline,
        about_paragraphs: settings.about_paragraphs,
        contact_headline: settings.contact_headline,
        email: settings.email,
        linkedin_url: settings.linkedin_url,
        footer_tagline: settings.footer_tagline,
      })
      .eq('id', settings.id);

    setSaving(false);
    if (error) {
      showToast('Failed to save settings', 'error');
    } else {
      showToast('Settings saved successfully');
      setDirty(false);
    }
  };

  if (loading) return <div className="text-ink-muted">Loading...</div>;
  if (!settings) return <div className="text-ink-muted">No settings found. Please run the seed data.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-1">Site Settings</h1>
          <p className="text-sm text-ink-muted">Edit your portfolio&apos;s global settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <Section title="Identity">
          <Field label="Name" value={settings.name} onChange={(v) => updateField('name', v)} />
          <Field label="Title" value={settings.title} onChange={(v) => updateField('title', v)} />
          <Field
            label="Headline (supports HTML for italic)"
            value={settings.headline}
            onChange={(v) => updateField('headline', v)}
          />
        </Section>

        <Section title="Company Badge">
          <Field label="Badge Text" value={settings.company_badge_text} onChange={(v) => updateField('company_badge_text', v)} />
          <Field label="Badge URL" value={settings.company_badge_url} onChange={(v) => updateField('company_badge_url', v)} />
        </Section>

        <Section title="Bio">
          {settings.bio_paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1">
                <Field
                  label={`Bio Paragraph ${i + 1}`}
                  value={p}
                  onChange={(v) => {
                    const updated = [...settings.bio_paragraphs];
                    updated[i] = v;
                    updateField('bio_paragraphs', updated);
                  }}
                  multiline
                />
              </div>
              {settings.bio_paragraphs.length > 1 && (
                <button
                  onClick={() => {
                    const updated = settings.bio_paragraphs.filter((_, idx) => idx !== i);
                    updateField('bio_paragraphs', updated);
                  }}
                  className="mt-6 px-2 py-1 rounded text-xs text-red-600 hover:bg-red-50 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => updateField('bio_paragraphs', [...settings.bio_paragraphs, ''])}
            className="text-sm text-ocean hover:underline"
          >
            + Add paragraph
          </button>
        </Section>

        <Section title="Photo">
          <Field
            label="Photo URL"
            value={settings.photo_url || ''}
            onChange={(v) => updateField('photo_url', v || null)}
          />
          {settings.photo_url && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={settings.photo_url} alt="Photo preview" className="h-24 rounded-lg object-cover" />
            </div>
          )}
        </Section>

        <Section title="About Section">
          <Field label="About Headline" value={settings.about_headline} onChange={(v) => updateField('about_headline', v)} multiline />
          {settings.about_paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1">
                <Field
                  label={`About Paragraph ${i + 1}`}
                  value={p}
                  onChange={(v) => {
                    const updated = [...settings.about_paragraphs];
                    updated[i] = v;
                    updateField('about_paragraphs', updated);
                  }}
                  multiline
                />
              </div>
              {settings.about_paragraphs.length > 1 && (
                <button
                  onClick={() => {
                    const updated = settings.about_paragraphs.filter((_, idx) => idx !== i);
                    updateField('about_paragraphs', updated);
                  }}
                  className="mt-6 px-2 py-1 rounded text-xs text-red-600 hover:bg-red-50 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => updateField('about_paragraphs', [...settings.about_paragraphs, ''])}
            className="text-sm text-ocean hover:underline"
          >
            + Add paragraph
          </button>
        </Section>

        <Section title="Contact">
          <Field label="Contact Headline" value={settings.contact_headline} onChange={(v) => updateField('contact_headline', v)} />
          <Field label="Email" value={settings.email} onChange={(v) => updateField('email', v)} />
          <Field label="LinkedIn URL" value={settings.linkedin_url} onChange={(v) => updateField('linkedin_url', v)} />
        </Section>

        <Section title="Footer">
          <Field label="Footer Tagline" value={settings.footer_tagline} onChange={(v) => updateField('footer_tagline', v)} />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-ink/[0.06] p-6">
      <h2 className="font-serif text-lg mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium tracking-wider uppercase text-ink-muted mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition"
        />
      )}
    </div>
  );
}
