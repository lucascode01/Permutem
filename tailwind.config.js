/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0071ce',
        secondary: '#005fad',
        accent: '#0071ce',
        text: '#333333',
        background: '#f9fafb',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'hero': '48px',
        'subtitle': '24px',
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
} 