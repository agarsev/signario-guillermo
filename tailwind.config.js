const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./src/*.js", "./src/*/*.{html,js}"],
  theme: {
    colors: {
      gray: colors.zinc,
      primary: colors.amber,
      secondary: colors.violet,
      white: colors.white,
      transparent: 'transparent',
      current: 'currentColor',
    }
  },
  variants: {},
  plugins: [],
};
