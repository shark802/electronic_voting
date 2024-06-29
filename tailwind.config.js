/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./views/**/*.ejs"],
	theme: {
		extend: {},
	},
	plugins: [
		function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          /* For Firefox */
          'scrollbar-width': 'none',
          /* For Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
	],
};
