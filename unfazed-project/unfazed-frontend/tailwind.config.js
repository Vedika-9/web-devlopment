/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F5F0',
        ink: '#1C2B29',
        moss: {
          50: '#EEF3F0',
          100: '#D8E5DE',
          300: '#8FB3A2',
          500: '#3F6B5E',
          600: '#335A4F',
          700: '#284840',
        },
        clay: '#C1704F',
        line: '#DDD8CC',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
};
