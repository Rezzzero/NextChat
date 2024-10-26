import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        chatHeaderBg: "var(--chat-header-bg)",
        chatColor: "var(--chat-color)",
        textColor: "var(--text-color)",
        filterButton: "var(--filter-button)",
        filterButtonActive: "var(--filter-button-active)",
        filterButtonBorder: "var(--filter-button-border)",
        filterButtonDisabled: "var(--filter-button-disabled)",
        filterButtonTextDisabled: "var(--filter-button-text-disabled)",
      },
    },
  },
  plugins: [],
};
export default config;
