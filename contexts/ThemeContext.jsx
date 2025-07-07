// contexts/ThemeContext.jsx

import { createContext, useContext, useMemo, useState } from 'react';
import { THEMES } from '../constants/themes';

// Create a context with a default value
const ThemeContext = createContext({
  theme: THEMES.light,
  isDarkMode: false,
  toggleTheme: () => {},
});

// Create a provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  
  // Use useMemo to prevent re-calculating the theme on every render
  const theme = useMemo(() => isDarkMode ? THEMES.dark : THEMES.light, [isDarkMode]);

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the theme context easily
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};