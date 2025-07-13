// constants/themes.js

export const blueTheme = {
  primary: "#1E88E5",
  background: "#F5F5F5",
  text: "#121212",
  textSecondary: "#6C757D", // ✅ more design flexibility
  border: "#E0E0E0",
  white: "#FFFFFF",
  card: "#FFFFFF",
  shadow: "#000000",
  success: '#28A745',
  danger: '#E63946',
  warning: '#FFC107',
};

export const blackTheme = {
  primary: "#1E88E5",       // Keep the primary blue for accent
  background: "#121212",    // Dark gray background
  text: "#FFFFFF",          // White text for contrast
  textSecondary: "#B0B0B0", // Light gray text for secondary info
  border: "#2C2C2C",        // Subtle dark border
  white: "#FFFFFF",
  card: "#1E1E1E",          // Slightly lighter card background
  shadow: "#000000",
  success: '#28A745',
  danger: '#E63946',
  warning: '#FFC107',
};

// Add other themes here in the same format
export const coffeeTheme = {
  primary: "#8B593E",
  background: "#FFF8F3",
  text: "#4A3428",
  textSecondary: "#9A8478",
  border: "#E5D3B7",
  white: "#FFFFFF",
  card: "#FFFFFF",
  shadow: "#000000",
  success: '#28A745',
  danger: '#E63946',
  warning: '#FFC107',
};

export const THEMES = {
  light: blueTheme, // Default light theme
  dark: blackTheme, // Default dark theme
  coffee: coffeeTheme,
  // ... add other themes here
};