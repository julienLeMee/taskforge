'use client';

import { useEffect, useState } from 'react';

const themes = [
  { id: 'default', name: 'Default' },
  { id: 'theme-tangerine-light', name: 'Tangerine Light' },
  { id: 'theme-tangerine-dark', name: 'Tangerine Dark' },
];

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove(...themes.map(t => t.id).filter(id => id !== 'default'));
    // Add the selected theme class if it's not default
    if (currentTheme !== 'default') {
      document.documentElement.classList.add(currentTheme);
    }
  }, [currentTheme]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="theme-select" className="text-sm font-medium text-muted-foreground">
        Color Theme
      </label>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={(e) => setCurrentTheme(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
}
