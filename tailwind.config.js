/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: '#fff8f6', dim: '#ebd6cd', bright: '#fff8f6' },
        'surface-container': { DEFAULT: '#ffede7', lowest: '#ffffff', low: '#fff1eb', high: '#f9e2d9', highest: '#f4d7cc' },
        'on-surface': { DEFAULT: '#231a16', variant: '#53433e' },
        outline: { DEFAULT: '#85736d', variant: '#d8c2bb' },
        primary: { DEFAULT: '#e8742a', container: '#ffdbcc' },
        'on-primary': { DEFAULT: '#ffffff', container: '#351000' },
        secondary: { DEFAULT: '#77574b', container: '#ffdbcc' },
        'on-secondary': { DEFAULT: '#ffffff', container: '#2c160d' },
        tertiary: { DEFAULT: '#695e2f', container: '#f2e2a7' },
        'on-tertiary': { DEFAULT: '#ffffff', container: '#221b00' },
        error: { DEFAULT: '#ba1a1a', container: '#ffdad6' },
        'on-error': { DEFAULT: '#ffffff', container: '#410002' },
        'hitesh-orange': '#E8742A',
        'piyush-teal': '#0D9488',
        charcoal: '#1C1917',
        success: '#16A34A',
        warning: '#D97706',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      spacing: {
        '2xs': '2px',
        md: '16px',
        '3xl': '64px',
        sm: '8px',
        lg: '24px',
        '2xl': '48px',
        xs: '4px',
        xl: '32px',
      },
      fontFamily: {
        display: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'headline-xl': ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'title-md': ['18px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
