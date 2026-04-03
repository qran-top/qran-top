import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'dhuhr' | 'duha' | 'isha';

const themes: Theme[] = ['light', 'dark', 'dhuhr', 'isha', 'duha'];

const themeDetails: Record<Theme, { name: string; emoji: string; isDark: boolean; primaryColor: string }> = {
  light: { name: 'الوضع النهاري', emoji: '☀️', isDark: false, primaryColor: '#22c55e' },
  dark: { name: 'الوضع الليلي', emoji: '🌙', isDark: true, primaryColor: '#22c55e' },
  dhuhr: { name: 'الظهر البسيط', emoji: '☀️', isDark: false, primaryColor: '#007bff' },
  duha: { name: 'الضحى المشرق', emoji: '✨', isDark: false, primaryColor: '#DAA520' },
  isha: { name: 'العشاء الفاخر', emoji: '🌃', isDark: true, primaryColor: '#ffd700' },
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme && themes.includes(storedTheme as Theme)) {
            return storedTheme as Theme;
        }
    } catch (e) {
        console.error("Could not access localStorage to get theme.", e);
    }
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  const applyTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeClassesToRemove = ['dark', ...themes.map(t => `theme-${t}`)];
    document.documentElement.classList.remove(...themeClassesToRemove);

    document.documentElement.classList.add(`theme-${newTheme}`);
    if (themeDetails[newTheme].isDark) {
        document.documentElement.classList.add('dark');
    }
  }, []);

  // This useEffect was removed as it can cause a theme "flash" on load.
  // The inline script in index.html handles the initial theme setting perfectly before any content renders.
  // React's state is initialized correctly and will be in sync.
  /* 
  useEffect(() => {
    applyTheme(theme);
  }, []); 
  */

  const cycleTheme = useCallback(() => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
            const newSystemTheme = e.matches ? 'dark' : 'light';
            applyTheme(newSystemTheme);
        }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyTheme]);


  const currentThemeDetails = themeDetails[theme];
  const nextThemeDetails = themeDetails[themes[(themes.indexOf(theme) + 1) % themes.length]];

  return {
    theme,
    cycleTheme,
    name: currentThemeDetails.name,
    emoji: currentThemeDetails.emoji,
    isDark: currentThemeDetails.isDark,
    nextThemeName: nextThemeDetails.name,
    nextThemePrimaryColor: nextThemeDetails.primaryColor,
  };
};