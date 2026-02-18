import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#F6F3EE',
          alt: '#EDE9E1',
        },
        ink: {
          DEFAULT: '#1A1814',
          light: '#6B6560',
          muted: '#9B9590',
        },
        accent: {
          DEFAULT: '#C8553D',
          soft: '#E8A090',
        },
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['DM Sans', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        content: '1100px',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up-delay-1': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
        'fade-up-delay-2': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards',
        'fade-up-delay-3': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards',
        'fade-up-delay-4': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.65s forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
