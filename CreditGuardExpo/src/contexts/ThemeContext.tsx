import React, {createContext, useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Theme,
  ThemeMode,
  ColorScheme,
  LightTheme,
  getTheme,
  THEME_STORAGE_KEY,
  DEFAULT_THEME_MODE,
} from '../constants/Themes';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
  systemColorScheme: ColorScheme | null | undefined;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (
        savedTheme &&
        (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')
      ) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Silently fail
    }
  };

  const toggleTheme = () => {
    const currentTheme = getTheme(themeMode, systemColorScheme);
    const newMode = currentTheme.isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  // Calculate current theme based on mode and system preference
  const theme = isLoading ? LightTheme : getTheme(themeMode, systemColorScheme);
  const isDark = theme.isDark;

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    isDark,
    toggleTheme,
    systemColorScheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook for using theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper hooks for common theme operations
export const useColors = () => {
  const {theme} = useTheme();
  return theme.colors;
};

export const useTextStyles = () => {
  const {theme} = useTheme();
  return theme.textStyles;
};

export const useSpacing = () => {
  const {theme} = useTheme();
  return {spacing: theme.spacing, spacingScale: theme.spacingScale};
};

export const useTypography = () => {
  const {theme} = useTheme();
  return theme.typography;
};

// Helper for creating themed styles
export const createThemedStyles = <T extends Record<string, unknown>>(
  stylesFn: (theme: Theme) => T,
) => {
  return (theme: Theme) => stylesFn(theme);
};

// Status bar style helper
export const getStatusBarStyle = (isDark: boolean) => {
  return isDark ? 'light-content' : 'dark-content';
};

export default ThemeProvider;
