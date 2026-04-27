import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        title: '#1b1b1b',
        highlight: '#7f704f',
        gold: '#b69145',
        'dark-red': '#7B1C1C',
      },
      keyframes: {
        'slide-in-left': {
          '0%': { transform: 'translateX(-120%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(120%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-up': {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'envelope-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'music-spin': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'left': 'slide-in-left 0.8s ease-out forwards',
        'right': 'slide-in-right 0.8s ease-out forwards',
        'up': 'fade-up 0.8s ease-out forwards',
        'bounce': 'envelope-bounce 3s ease-in-out infinite',
        'music-spin': 'music-spin 4s linear infinite',
      },
    },
  },
};

export default config;
