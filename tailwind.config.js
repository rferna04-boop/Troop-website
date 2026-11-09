/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scout: { 50: '#f2f7f3', 100: '#e1efe4', 500: '#39693B', 600: '#2d532f', 700: '#224024' },
      },
    },
  },
  plugins: [],
}