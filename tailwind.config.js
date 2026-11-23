/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#151517',
          light: '#2A2A2E',
        },
        muted: '#62626A',
        faint: '#93939B',
        line: {
          DEFAULT: '#E8E8EB',
          dark: '#D6D6DB',
        },
        coral: {
          DEFAULT: '#D2553A',
          ink: '#B8442B',
          tint: '#FDEDE8',
          row: '#FEF6F3',
        },
        ok: {
          DEFAULT: '#4F7F5E',
          tint: '#E6F0E8',
        },
        warn: {
          DEFAULT: '#8A6414',
          tint: '#FBF1DC',
        },
        soft: '#FAFAFB',
        surface: {
          1: '#FFFFFF',
          2: '#F5F5F6',
          3: '#ECECEE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(21,21,23,.03), 0 14px 36px -14px rgba(21,21,23,.16), 0 2px 6px -2px rgba(21,21,23,.05)',
        big: '0 50px 100px -40px rgba(21,21,23,.26), 0 18px 40px -24px rgba(21,21,23,.14)',
      }
    },
  },
  plugins: [],
}
