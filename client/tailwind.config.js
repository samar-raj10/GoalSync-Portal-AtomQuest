/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        goalsync: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#0f766e',
          neutral: '#1f2937',
          'base-100': '#ffffff',
          'base-200': '#f3f4f6',
          'base-300': '#e5e7eb',
          info: '#0284c7',
          success: '#16a34a',
          warning: '#d97706',
          error: '#dc2626'
        }
      }
    ]
  }
};
