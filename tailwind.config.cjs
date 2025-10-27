const config = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f0f10',
        panel: '#1c1c1f',
        accent: '#d62828',
        accentMuted: '#8d1d1d'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

module.exports = config;
