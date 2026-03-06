import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      tablet: '901px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: '#FDFCFA',
          alt: '#F0EDE6',
          surface: '#F5F0E8',
        },
        ink: {
          DEFAULT: '#1E1C19',
          light: '#4A4540',
          muted: '#6B6560',
          faint: '#6B6560',
          ghost: '#8A8480',
        },
        ocean: {
          DEFAULT: '#5A8A9A',
          dark: '#3D6E7A',
        },
        sand: '#C68C5A',
        tide: '#3D6E5C',
      },
      fontFamily: {
        serif: ['Noto Serif', 'Georgia', 'serif'],
        sans: ['Noto Sans', '-apple-system', 'sans-serif'],
        pixel: ['Silkscreen', 'cursive'],
      },
      maxWidth: {
        content: '920px',
      },
    },
  },
  plugins: [],
};
export default config;
