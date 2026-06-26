import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef4ff',
          100: '#dae6ff',
          200: '#bdd2ff',
          300: '#90b5ff',
          400: '#5b8eff',
          500: '#3366ff',
          600: '#004FBA',
          700: '#003d94',
          800: '#002d6e',
          900: '#001e4a',
          950: '#000f26',
        },
      },
      fontFamily: {
        sans:    ['Segoe UI', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['DM Serif Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
