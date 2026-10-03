/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Premium Earth-Tone Palette ────────────────────────── */
        farmGreen: {
          950: '#0B3D2E',
          900: '#0F4D38',
          800: '#14553E',
          700: '#1A6B4D',
          600: '#228A5F',
          500: '#2EA672',
          400: '#4FBE8A',
          300: '#7ED4A8',
          200: '#B5E6CC',
          100: '#D6F0E2',
          50:  '#EDF8F2',
        },
        farmGold: {
          950: '#3D2E0B',
          900: '#6B4F14',
          800: '#8B6A1E',
          700: '#B08728',
          600: '#D4A745',
          500: '#E0B85A',
          400: '#EAC97A',
          300: '#F2D99A',
          200: '#F7E8BB',
          100: '#FBF2DA',
          50:  '#FDFAF0',
        },
        farmTerracotta: {
          700: '#8B4D35',
          600: '#A65E42',
          500: '#C67B5C',
          400: '#D4967A',
          300: '#E2B19E',
          200: '#EDCABC',
          100: '#F6E4DB',
          50:  '#FBF2ED',
        },
        farmSage: {
          700: '#3D4F3E',
          600: '#4D634F',
          500: '#5C6B5E',
          400: '#7A8A7C',
          300: '#99A99B',
          200: '#BCC8BD',
          100: '#DCE4DD',
          50:  '#EEF2EF',
        },
        farmBg: '#F7F5F0',
        linen: '#F7F5F0',
        farmCream: '#FFFBEB',
        farmText: '#1A2E1D',
        farmMuted: '#3D4F3E',        /* Calibrated from #5C6B5E to achieve 5.2:1 contrast ratio against #F7F5F0 */
        farmMutedLight: '#526654',   /* For large headers and non-critical subtitles */
        farmMutedDark: '#2C3B2E',    /* For small helper text requiring AAA compliance */
        /* ── Legacy compat shims ──────────────────────────────── */
        farmOrange: {
          700: '#B08728',
          600: '#D4A745',
          500: '#D4A745',
          400: '#E0B85A',
          100: '#FBF2DA',
          50:  '#FDFAF0',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'farm-sm':  '0 1px 3px rgba(11,61,46,.05), 0 1px 2px rgba(11,61,46,.04)',
        'farm-md':  '0 4px 14px rgba(11,61,46,.07), 0 2px 6px rgba(11,61,46,.04)',
        'farm-lg':  '0 12px 36px rgba(11,61,46,.09), 0 4px 14px rgba(11,61,46,.05)',
        'farm-xl':  '0 24px 64px rgba(11,61,46,.12), 0 8px 28px rgba(11,61,46,.06)',
        'organic':     '0 2px 12px rgba(11,61,46,.06), 0 1px 3px rgba(11,61,46,.04)',
        'organic-md':  '0 8px 24px rgba(11,61,46,.08), 0 2px 6px rgba(11,61,46,.04)',
        'organic-lg':  '0 16px 48px rgba(11,61,46,.10), 0 4px 14px rgba(11,61,46,.05)',
        'glass':    '0 8px 32px rgba(11,61,46,.08), inset 0 1px 0 rgba(255,255,255,.15)',
        'glass-lg': '0 16px 48px rgba(11,61,46,.12), inset 0 1px 0 rgba(255,255,255,.2)',
        'glass-dark': '0 8px 32px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.06)',
        'gold-glow': '0 0 20px rgba(212,167,69,.25), 0 0 6px rgba(212,167,69,.15)',
        'gold-glow-lg': '0 0 32px rgba(212,167,69,.3), 0 0 8px rgba(212,167,69,.2)',
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
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,167,69,0.4)' },
          '50%': { boxShadow: '0 0 16px 4px rgba(212,167,69,0.15)' },
        },
        cardFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-6px) rotate(0.5deg)' },
          '66%': { transform: 'translateY(-3px) rotate(-0.5deg)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmerSlide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(8px)' },
          '60%': { transform: 'scale(1.04) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        /* ── NEW Premium Animations ───────────────────────── */
        glassShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        staggerIn: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        tooltipSlideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,167,69,0.5)' },
          '50%': { boxShadow: '0 0 0 6px rgba(212,167,69,0)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width, 100%)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.15' },
          '33%': { transform: 'translate(20px, -15px) scale(1.1)', opacity: '0.25' },
          '66%': { transform: 'translate(-10px, 10px) scale(0.95)', opacity: '0.2' },
        },
        dotPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out both',
        marquee: 'marquee 22s linear infinite',
        shimmer: 'shimmer 1.6s infinite',
        scaleIn: 'scaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        slideUp: 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        glowPulse: 'glowPulse 2.5s ease-in-out infinite',
        cardFloat: 'cardFloat 6s ease-in-out infinite',
        bounceIn: 'bounceIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmerSlide: 'shimmerSlide 1.8s ease-in-out infinite',
        wiggle: 'wiggle 0.4s ease-in-out',
        popIn: 'popIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        /* ── NEW ─────────────────────────────────────────── */
        glassShimmer: 'glassShimmer 3s ease-in-out infinite',
        staggerIn: 'staggerIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        tooltipSlideIn: 'tooltipSlideIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both',
        goldPulse: 'goldPulse 2s ease-in-out infinite',
        progressFill: 'progressFill 1s cubic-bezier(0.22, 1, 0.36, 1) both',
        orbFloat: 'orbFloat 8s ease-in-out infinite',
        dotPulse: 'dotPulse 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backdropBlur: {
        'glass': '16px',
        'glass-lg': '24px',
      },
    },
  },
  plugins: [],
}
