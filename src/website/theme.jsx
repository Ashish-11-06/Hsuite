// src/website/theme.js

const createTheme = (colors = {}) => ({
  colors: {
    primary: colors.primary || "#1f3c88",
    secondary: colors.secondary || "#FFA500",
    background: colors.background || "#ffffff",
    text: colors.text || "#333333",
    navbarBg: colors.navbarBg || "#ffffff",
    navbarText: colors.navbarText || "#000000",
    borderColor: colors.borderColor || "#E0E0E0",
  },
  fonts: {
    body: "'Roboto', sans-serif",
    heading: "'Poppins', sans-serif",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
  },
});

export default createTheme;
