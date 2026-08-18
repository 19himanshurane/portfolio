import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => localStorage.getItem('theme') || 'system');
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemTheme(getSystemTheme());
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const resolved = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    localStorage.setItem('theme', preference);
    document.documentElement.setAttribute('data-theme', resolved);
  }, [preference, resolved]);

  const toggle = useCallback(() => {
    setPreference(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved]);

  const value = useMemo(
    () => ({ theme: resolved, preference, setTheme: setPreference, toggle }),
    [resolved, preference, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
