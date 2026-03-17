/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D0D0D',
        surface: '#1A1A1A',
        card: '#222222',
        accent: '#00E5A0',
        'accent-dim': '#00B87A',
        muted: '#666666',
        border: '#2A2A2A',
      },
    },
  },
  plugins: [],
}

