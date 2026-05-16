/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind 3.x scans these files and generates only the utilities used by React.
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {}
  },
  plugins: []
};
