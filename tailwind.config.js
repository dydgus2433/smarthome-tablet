/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#1e293b',
          card: '#0f172a',
          hover: '#334155',
        }
      },
      gridTemplateColumns: {
        'device': 'repeat(auto-fill, minmax(220px, 1fr))',
      }
    },
  },
  plugins: [],
}
