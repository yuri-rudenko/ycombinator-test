import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      prefix: "heroui",
      addCommonColors: false,
      defaultTheme: "dark",
      defaultExtendTheme: "light",
      layout: {},
      themes: {
        light: {
          layout: {},
          colors: {
            background: "#FBFBFA",
            foreground: "#141414",
            primary: "#527560",
            secondary: "#7A8C81",
            warning: "#D9AA1E",
            danger: "#E64540",
            success: "#639435",
            focus: "#527560",
            content1: "#FFFFFF",
            content2: "#F4F4F2",
          },
        },
        dark: {
          layout: {},
          colors: {
            background: "#141414",
            primary: "#638C73",
            secondary: "#6e8476",
            warning: "#F9CC36",
            danger: "#FF524C",
            success: "#7AB542",
            focus: "#638C73",
          },
        },
      },
    }),
  ],
};

export default config;
