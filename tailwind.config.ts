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
          DEFAULT: '#FAF8F4',
          alt: '#F0EDE6',
          surface: '#F5F0E8',
        },
        ink: {
          DEFAULT: '#2A2824',
          light: '#6B6660',
          muted: '#A09A92',
          faint: '#B5AFA5',
          ghost: '#C4BDB4',
        },
        ocean: {
          DEFAULT: '#5A8A9A',
          dark: '#3D6E7A',
        },
        sand: '#C68C5A',
        tide: '#3D6E5C',
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Instrument Sans', '-apple-system', 'sans-serif'],
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
