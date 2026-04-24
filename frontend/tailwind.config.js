export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef3ec',
          100: '#fde8d8',
          500: '#f97316',   // orange — the brand color
          600: '#ea6c10',
          700: '#c2570c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [],
}