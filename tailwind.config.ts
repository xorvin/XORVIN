import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        xorvin: {
          primary:  '#007BFF',
          dark:     '#050B18',
          bg:       '#081321',
          white:    '#FFFFFF',
          accent:   '#30D5FF',
          'primary-light': '#3395FF',
          'primary-dark':  '#0060CC',
          'accent-light':  '#60E0FF',
          'gray-800':      '#0D1E36',
          'gray-700':      '#112440',
          'gray-600':      '#1A3356',
          'gray-400':      '#4A7AA8',
          'gray-300':      '#7AAED6',
          'gray-200':      '#A8CCE8',
          'gray-100':      '#D4E6F4',
        },
      },
      fontFamily: {
        'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
        'inter':         ['"Inter"',         'sans-serif'],
      },
      animation: {
        'float':            'float 6s ease-in-out infinite',
        'float-slow':       'float 9s ease-in-out infinite',
        'float-fast':       'float 4s ease-in-out infinite',
        'pulse-glow':       'pulse-glow 2s ease-in-out infinite',
        'gradient-shift':   'gradient-shift 8s ease infinite',
        'marquee':          'marquee 30s linear infinite',
        'marquee-reverse':  'marquee-reverse 30s linear infinite',
        'spin-slow':        'spin 12s linear infinite',
        'ping-slow':        'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in':          'fade-in 0.5s ease-in-out forwards',
        'slide-up':         'slide-up 0.5s ease-out forwards',
        'scale-in':         'scale-in 0.3s ease-out forwards',
        'beam':             'beam 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #007BFF, 0 0 20px #007BFF40' },
          '50%':       { boxShadow: '0 0 20px #007BFF, 0 0 60px #007BFF80, 0 0 80px #30D5FF40' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':       { backgroundPosition: '100% 50%' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        beam: {
          '0%':   { transform: 'translateX(-100%) skewX(-15deg)', opacity: '0' },
          '30%':  { opacity: '1' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)', opacity: '0' },
        },
      },
      backgroundImage: {
        'grid-pattern':      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23007BFF10' stroke-width='1'/%3E%3C/svg%3E\")",
        'hero-gradient':     'radial-gradient(ellipse at 20% 50%, #007BFF20 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, #30D5FF15 0%, transparent 60%)',
        'card-gradient':     'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'primary-gradient':  'linear-gradient(135deg, #007BFF 0%, #30D5FF 100%)',
        'dark-gradient':     'linear-gradient(180deg, #050B18 0%, #081321 100%)',
        'section-gradient':  'linear-gradient(180deg, #081321 0%, #0D1E36 50%, #081321 100%)',
      },
      boxShadow: {
        'glow-sm':  '0 0 10px rgba(0, 123, 255, 0.3)',
        'glow':     '0 0 20px rgba(0, 123, 255, 0.4), 0 0 40px rgba(0, 123, 255, 0.2)',
        'glow-lg':  '0 0 40px rgba(0, 123, 255, 0.5), 0 0 80px rgba(0, 123, 255, 0.3)',
        'glow-accent': '0 0 20px rgba(48, 213, 255, 0.4)',
        'glass':    '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card':     '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
