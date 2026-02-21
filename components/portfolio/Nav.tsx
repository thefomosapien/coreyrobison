'use client';

import { useState, useEffect } from 'react';

interface NavProps {
  name: string;
}

const NAV_LINKS: [string, string][] = [
  ['Work', '#work'],
  ['Thoughts', '#thoughts'],
  ['Journey', '#journey'],
  ['About', '#about'],
  ['Contact', '#contact'],
];

export default function Nav({ name }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="max-w-content mx-auto flex justify-between items-center relative z-10"
        style={{ padding: '24px 24px 16px' }}
      >
        <a href="#" className="font-serif" style={{ fontSize: 17, color: '#2A2824' }}>
          {name}
        </a>

        {/* Desktop links */}
        <div className="hidden tablet:flex gap-5 font-pixel" style={{ fontSize: 10, color: '#A09A92' }}>
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="transition-colors duration-200 hover:text-ink"
              style={{ color: label === 'Contact' ? '#5A8A9A' : undefined }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex tablet:hidden flex-col justify-center items-center w-10 h-10 gap-[5px]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span
            className="block w-5 h-[2px] bg-ink rounded-full transition-all duration-300 origin-center"
            style={{ transform: menuOpen ? 'translateY(3.5px) rotate(45deg)' : 'none' }}
          />
          <span
            className="block w-5 h-[2px] bg-ink rounded-full transition-all duration-300 origin-center"
            style={{ transform: menuOpen ? 'translateY(-3.5px) rotate(-45deg)' : 'none' }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[99] bg-bg flex flex-col items-center justify-center gap-8 tablet:hidden">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="font-serif text-3xl tracking-tight text-ink hover:text-ocean transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
