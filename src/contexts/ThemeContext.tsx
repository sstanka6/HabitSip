import React, { createContext, useContext, useEffect, useState } from 'react';
import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { getString, saveString } from '../utils/storage';

type Preference = 'light' | 'dark' | 'system';

interface Palette {
  background: string;
  card: string;
  text: string;
  primary: string;
  border: string;
  success: string;
  error: string;
}

interface ThemeContextValue {
  preference: Preference;
  navTheme: Theme;
  palette: Palette;
  setPreference: (p: Preference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<Preference>('system');

  useEffect(() => {
    (async () => {
      const stored = (await getString('themePref')) as Preference | null;
      if (stored) setPreference(stored);
    })();
  }, []);

  const effectiveScheme = preference === 'system' ? systemScheme : preference;

  const isDark = effectiveScheme === 'dark';
  const navTheme: Theme = isDark
    ? {
        ...DarkTheme,
        colors: { ...DarkTheme.colors, primary: '#1E90FF' },
      }
    : {
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: '#f7f9fc', primary: '#1E90FF' },
      };

  const palette: Palette = isDark
    ? {
        background: '#121212',
        card: '#1e1e1e',
        text: '#f5f5f5',
        primary: '#1E90FF',
        border: '#333',
        success: '#4caf50',
        error: '#e53935',
      }
    : {
        background: '#f7f9fc',
        card: '#ffffff',
        text: '#0a1525',
        primary: '#1E90FF',
        border: '#ced4da',
        success: '#4caf50',
        error: '#e53935',
      };

  const setPref = (p: Preference) => {
    setPreference(p);
    saveString('themePref', p);
  };

  return (
    <ThemeContext.Provider value={{ preference, navTheme, palette, setPreference: setPref }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemePref() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemePref must be inside ThemeProvider');
  return ctx;
}

export function usePalette() {
  return useThemePref().palette;
}
