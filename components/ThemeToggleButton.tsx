import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from './icons';

const ThemeToggleButton: React.FC = () => {
  const { cycleTheme, name, nextThemeName, isDark } = useTheme();

  return (
    <button
      onClick={cycleTheme}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-subtle hover:bg-surface-hover transition-colors duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary"
      aria-label={`تغيير الوضع إلى ${nextThemeName}`}
      title={`الوضع الحالي: ${name}. اضغط للتغيير إلى وضع ${nextThemeName}.`}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-yellow-400" />
      ) : (
        <MoonIcon className="w-4 h-4 text-slate-600" />
      )}
    </button>
  );
};

export default ThemeToggleButton;