/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        primary_hover: '#2c77b8',
        secondary: '#e5e5e5',
      },
    },
  },
  plugins: [],
};
