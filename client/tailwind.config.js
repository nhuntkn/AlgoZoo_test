/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        impact: ['Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
      },
      colors: {
        sidebar: '#1a1f2e',
        'sidebar-hover': '#252b3d',
        accent: '#dc2626',
        'accent-hover': '#b91c1c',
      },
    },
  },
  plugins: [],
}
