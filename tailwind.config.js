module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/hero-bg.png')",
      },
      screens: {
        xs: "480px",
      }
    }
  },
  plugins: [],
};
