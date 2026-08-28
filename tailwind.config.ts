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
        // Understudy Labs (/understudylabs) — a separate brand identity from the rest of
        // this site, so its palette is namespaced rather than reusing/overriding the tokens
        // above. Charcoal/Cyan/Platinum per the 2026-08-28 brand refresh.
        'ul-charcoal': '#121212',
        'ul-navy': '#0a192f',
        'ul-cyan': '#00f0ff',
        'ul-platinum': '#e5e4e2',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
        'ul-heading': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'ul-body': ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
