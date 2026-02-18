'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '◉' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
  { href: '/admin/projects', label: 'Projects', icon: '◧' },
  { href: '/admin/journey', label: 'Journey', icon: '↗' },
  { href: '/admin/about', label: 'About', icon: '☻' },
  { href: '/admin/contact', label: 'Contact', icon: '✉' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-ink text-white rounded-lg flex items-center justify-center text-lg"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-60 bg-bg-alt border-r border-ink/10 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-ink/10">
          <Link href="/" className="font-serif text-lg tracking-tight">
            Corey Robison
          </Link>
          <div className="text-xs text-ink-muted mt-1">Admin Dashboard</div>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'text-ink font-medium bg-bg'
                    : 'text-ink-light hover:text-ink hover:bg-bg/50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-ink/10">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-2 py-2 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            ↗ View Site
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-2 py-2 text-sm text-ink-muted hover:text-accent transition-colors w-full text-left"
          >
            ← Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
