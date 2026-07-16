export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14b8a6", // Teal 500 (Tông sáng, fresh cho du lịch)
        secondary: "#f59e0b", // Amber 500
        background: "#f8fafc", // Slate 50
        surface: "#ffffff",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
