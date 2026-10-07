const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addUtilities, variants, theme }) {
  const levels = theme('brightness');
  const utilities = {};

  Object.keys(levels).forEach((modifier) => {
    utilities[`.brightness-${modifier}`] = {
      filter: levels[modifier]
    };
  });

  addUtilities(utilities, variants('brightness'));
});
