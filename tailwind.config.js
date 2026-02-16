/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0A0A0A',
        'dark-surface': '#141414',
        'dark-card': '#1A1A1A',
        'dark-border': '#262626',
        coral: '#FF3C5F',
        'coral-dim': 'rgba(255,60,95,0.12)',
        lime: '#BEFF00',
        'lime-dim': 'rgba(190,255,0,0.12)',
        indigo: '#6C63FF',
        'indigo-dim': 'rgba(108,99,255,0.12)',
        'text-primary': '#FAFAFA',
        'text-secondary': '#888888',
        'text-muted': '#555555',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
