/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#6366f1',
        secondary: '#8b5cf6',
        accent:    '#06b6d4',
        dark:      '#05050f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient':      'gradientShift 6s ease infinite',
        'float':         'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out 1.5s infinite',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'bounce-slow':   'bounce 2.5s infinite',
        'spin-slow':     'spin 10s linear infinite',
        'fade-in-up':    'fadeInUp 0.6s ease forwards',
        'slide-in-left': 'slideInLeft 0.5s ease forwards',
        'glow':          'glow 2s ease-in-out infinite',
      },
      keyframes: {
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-16px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-40px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(99,102,241,0.2)' },
          '50%':     { boxShadow: '0 0 50px rgba(99,102,241,0.5)' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
};
