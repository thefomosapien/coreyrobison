'use client';

import { useEffect, useState } from 'react';

interface NavProps {
  name: string;
}

export default function Nav({ name }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] px-8 py-5 flex justify-between items-center transition-all duration-400"
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
      <div className="flex gap-8 text-[0.85rem] font-medium tracking-widest uppercase">
        {['Work', 'Journey', 'About', 'Contact'].map((item) => (
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
    </nav>
  );
}
