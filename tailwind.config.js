/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Invitation palette, taken from the couple's studio photos.
      colors: {
        cream: '#FBF6EE',
        sand: '#EFE2CF',
        caramel: '#C08A55',
        bronze: '#8A5530',
        espresso: '#2A1B13',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

