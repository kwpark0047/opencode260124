/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts}',
    './types/**/*.{js,ts}',
    './workers/**/*.{js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}