/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farmGreen: {
          950: '#08170D',
          900: '#0F2818',
          800: '#1B5E20',
          700: '#2E7D32',
          600: '#388E3C',
          500: '#4CAF50',
          400: '#66BB6A',
          100: '#E8F5E9',
          50:  '#F1F8F2',
        },
        farmOrange: {
          600: '#F57C00',
          500: '#FF9800',
          400: '#FFA726',
          100: '#FFF3E0',
        },
        farmBg: '#F8F9FA',
        farmCream: '#FCFBF7',
        farmText: '#1F2A1F',
        farmMuted: '#5A6B5E',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'farm-sm':  '0 1px 2px rgba(15,40,24,.04), 0 1px 3px rgba(15,40,24,.06)',
        'farm-md':  '0 4px 12px rgba(15,40,24,.06), 0 2px 4px rgba(15,40,24,.04)',
        'farm-lg':  '0 12px 32px rgba(15,40,24,.08), 0 4px 12px rgba(15,40,24,.05)',
        'farm-xl':  '0 24px 60px rgba(15,40,24,.12), 0 8px 24px rgba(15,40,24,.06)',
      },
      borderRadius: {
        'farm-sm': '8px',
        'farm-md': '14px',
        'farm-lg': '20px',
        'farm-xl': '28px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out both',
        marquee: 'marquee 22s linear infinite',
        shimmer: 'shimmer 1.6s infinite',
        scaleIn: 'scaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
