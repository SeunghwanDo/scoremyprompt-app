/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        'bg-dark': 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      backgroundColor: {
        dark: 'var(--color-bg)',
        surface: 'var(--color-surface)',
      },
      textColor: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
      },
      borderColor: {
        primary: 'var(--color-border)',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
      minWidth: {
        touch: 'var(--touch-target-min)',
      },
      minHeight: {
        touch: 'var(--touch-target-min)',
      },
    },
  },
  plugins: [],
};
