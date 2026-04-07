import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(dark));
    // Update theme-color meta tag
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0f172a' : '#0d9488');
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}
