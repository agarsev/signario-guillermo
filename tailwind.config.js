const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./src/*.js", "./src/*/*.{html,js}", "./lib/*.js"],
  theme: {
    colors: {
      gray: colors.zinc,
      primary: colors.amber,
      secondary: colors.violet,
      white: colors.white,
      transparent: 'transparent',
      signotatormain: colors.amber,
      signotatorbtns: colors.violet,
      signotatorbg: colors.zinc[200],
      current: 'currentColor',
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography')
  ],
};
