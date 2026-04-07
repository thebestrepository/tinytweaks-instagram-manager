/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#141720',
          2: '#1c2030',
          3: '#222840',
        },
        accent: {
          DEFAULT: '#f0b429',
          dim: 'rgba(240, 180, 41, 0.12)',
        },
        mint: '#4eca8b',
        coral: '#e07b6e',
        sky: '#5aabee',
        lilac: '#b89fd4',
        sage: '#7db88a',
        bluegrey: '#7a9bb5',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
