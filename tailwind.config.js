/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        accent: '#8b5cf6',
        'bg-dark': '#0a0f1a',
        'surface': '#0f172a',
        'border': '#1e293b',
      },
      backgroundColor: {
        dark: '#0a0f1a',
        surface: '#0f172a',
      },
      textColor: {
        primary: '#3b82f6',
        accent: '#8b5cf6',
      },
      borderColor: {
        primary: '#1e293b',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};
