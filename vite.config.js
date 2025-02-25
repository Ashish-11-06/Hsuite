import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // Updated theme variables based on the Teal Blue palette
          "@primary-color": "#17A2B8", // Teal Blue
          "@link-color": "#17A2B8", // Link color
          "@success-color": "#138496", // Dark Teal (used for success states)
          "@warning-color": "#FAAD14", // Keep warning color as default
          "@error-color": "#FF4D4F", // Keep error color as default
          "@font-size-base": "16px", // Base font size
          "@heading-color": "#138496", // Headings in Dark Teal
          "@text-color": "#343A40", // Charcoal Gray for text
          "@text-color-secondary": "#6C757D", // Muted Blue-Gray for secondary text
          "@border-radius-base": "4px", // Default border-radius
          "@border-color-base": "#D9D9D9", // Border color
          "@layout-header-background": "#FFFFFF", // White header background
          "@layout-sider-background": "#FFFFFF", // White sidebar background
          "@menu-dark-bg": "#138496", // Dark Teal for menu background
          "@menu-dark-item-active-bg": "#17A2B8", // Active menu item background color
        },
        javascriptEnabled: true,
      },
    },
  },
});
