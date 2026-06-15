import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0f1a',
        'bg-secondary': '#111827',
        'bg-card': '#1a2235',
        accent: '#f59e0b',
        'accent-soft': '#fbbf24',
        'text-primary': '#f9fafb',
        'text-secondary': '#9ca3af',
        border: '#1f2937',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
