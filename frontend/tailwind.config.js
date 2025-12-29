/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'under-2k': {
          max: '2000px',
        },
        'under-hd': {
          max: '1570px',
        },
        'smallMobile': {
          max: '768px',
        },
      },
    },
  },
  plugins: [],
}