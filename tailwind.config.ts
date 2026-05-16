import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-card': 'var(--bg-card)',
        'bg-hover': 'var(--bg-hover)',
        'border-dim': 'var(--border-dim)',
        'border-glow': 'var(--border-glow)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-green': 'var(--accent-green)',
        'accent-red': 'var(--accent-red)',
        'accent-yellow': 'var(--accent-yellow)',
        'accent-purple': 'var(--accent-purple)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-mono': 'var(--text-mono)',
      },
      boxShadow: {
        'glow-cyan': 'var(--glow-cyan)',
        'glow-green': 'var(--glow-green)',
        'glow-red': 'var(--glow-red)',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-space-grotesk)'],
        mono: ['var(--font-jetbrains-mono)'],
      },
      animation: {
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
