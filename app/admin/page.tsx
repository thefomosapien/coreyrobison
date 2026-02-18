'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Counts {
  projects: number;
  journeyItems: number;
  aboutDetails: number;
  contactLinks: number;
  lastUpdated: string | null;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [projects, journey, about, contact, settings] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('journey_items').select('id', { count: 'exact', head: true }),
        supabase.from('about_details').select('id', { count: 'exact', head: true }),
        supabase.from('contact_links').select('id', { count: 'exact', head: true }),
        supabase.from('site_settings').select('updated_at').single(),
      ]);
      setCounts({
        projects: projects.count || 0,
        journeyItems: journey.count || 0,
        aboutDetails: about.count || 0,
        contactLinks: contact.count || 0,
        lastUpdated: settings.data?.updated_at || null,
      });
    }
    load();
  }, []);

  const cards = counts
    ? [
        { label: 'Projects', count: counts.projects, href: '/admin/projects' },
        { label: 'Journey Items', count: counts.journeyItems, href: '/admin/journey' },
        { label: 'About Details', count: counts.aboutDetails, href: '/admin/about' },
        { label: 'Contact Links', count: counts.contactLinks, href: '/admin/contact' },
      ]
    : [];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Dashboard</h1>
      <p className="text-sm text-ink-muted mb-8">
        {counts?.lastUpdated
          ? `Last updated ${new Date(counts.lastUpdated).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}`
          : 'Loading...'}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl p-5 border border-ink/[0.06] hover:border-ink/10 transition group"
          >
            <div className="text-3xl font-serif mb-1 group-hover:text-accent transition-colors">
              {card.count}
            </div>
            <div className="text-sm text-ink-muted">{card.label}</div>
          </a>
        ))}
      </div>

      <div className="mt-8 p-5 bg-white rounded-xl border border-ink/[0.06]">
        <h2 className="font-serif text-lg mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/settings" className="px-4 py-2 rounded-lg bg-bg-alt text-sm font-medium hover:bg-ink hover:text-white transition">
            Edit Settings
          </a>
          <a href="/admin/projects" className="px-4 py-2 rounded-lg bg-bg-alt text-sm font-medium hover:bg-ink hover:text-white transition">
            Manage Projects
          </a>
          <a href="/" target="_blank" className="px-4 py-2 rounded-lg bg-bg-alt text-sm font-medium hover:bg-ink hover:text-white transition">
            View Live Site ↗
          </a>
        </div>
      </div>
    </div>
  );
}
