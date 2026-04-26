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
    },
  },
};

export default config;
