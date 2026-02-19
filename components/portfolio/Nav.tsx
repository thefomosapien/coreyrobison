'use client';

import { useEffect, useState } from 'react';

interface NavProps {
  name: string;
}

export default function Nav({ name }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navItems = ['Work', 'Journey', 'About', 'Contact'];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] px-5 tablet:px-8 py-5 flex justify-between items-center transition-all duration-400"
        style={{
          background: 'rgba(246, 243, 238, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid rgba(26, 24, 20, ${scrolled ? '0.1' : '0.06'})`,
        }}
      >
        <a href="#" className="font-serif text-lg tracking-tight">
          {name}
        </a>

        {/* Desktop links — hidden on mobile, visible at tablet (901px+) */}
        <div className="hidden tablet:flex gap-8 text-[0.85rem] font-medium tracking-widest uppercase">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-ink-light hover:text-ink transition-colors duration-300 group"
            >
              {item}
              <span className="absolute bottom-[-3px] left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Mobile hamburger — visible by default, hidden at tablet (901px+) */}
        <button
          className="flex tablet:hidden flex-col justify-center items-center w-10 h-10 gap-[6px]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span
            className="block w-6 h-[2px] bg-ink rounded-full transition-all duration-300 origin-center"
            style={{
              transform: menuOpen ? 'translateY(4px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block w-6 h-[2px] bg-ink rounded-full transition-all duration-300 origin-center"
            style={{
              transform: menuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[99] bg-bg flex flex-col items-center justify-center gap-8 tablet:hidden">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-serif text-3xl tracking-tight text-ink hover:text-accent transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
