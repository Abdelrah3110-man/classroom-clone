/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4285f4',
          hover: '#3b78e7',
        },
        surface: '#ffffff',
        border: '#dadce0',
        text: {
          main: '#202124',
          secondary: '#5f6368',
        },
        bg: '#f8f9fa',
      },
      borderRadius: {
        'google': '12px',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
