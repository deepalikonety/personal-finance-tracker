// tailwind.config.js

module.exports = {
  content: [
    "./path/to/your/files/**/*.html",  // Update this with the correct path for your HTML/JSX files
    "./path/to/your/components/**/*.tsx",  // Update this with the correct path for your JSX/TSX files
  ],
  theme: {
    extend: {
      colors: {
        beige: '#F5F3E5',   // Light beige color
        'light-brown': '#D9C7A1', // Soft light brown
        cream: '#FFF5E1',    // Creamy beige color
        brown: {
          100: '#E5D1B2',   // Light brown
          200: '#C6A08D',   // Medium brown
          700: '#6B4F2C',   // Dark brown
          800: '#4E3629',   // Rich dark brown
        }
      }
    }
  },
  plugins: [],
}
