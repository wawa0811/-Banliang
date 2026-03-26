/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'sans': ['var(--font-inter)', 'system-ui'],
          'serif': ['var(--font-playfair)', '上海宋体', 'serif'],
          'cursive': ['var(--font-cedarville)', 'cursive'],
        },
        colors: {
          cream: '#FEF9E6',
          ivory: '#FFFCF0',
          warmGray: '#F3EFE2',
          accent: '#C7B48A',
          accentDark: '#A28F64',
          textSoft: '#5A564A',
        },
        animation: {
          'float': 'float 3s ease-in-out infinite',
          'fade-up': 'fade-up 0.6s ease-out forwards',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-8px)' },
          },
          'fade-up': {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
        },
      },
    },
    plugins: [],
  }