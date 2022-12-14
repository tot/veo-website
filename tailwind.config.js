/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      fontFamily: {
         sans: ["Inter, sans-serif"],
      },
      extend: {
         colors: {
            background: "#121212",
            "light-background": "#1F1F1F",
            "light-background-border": "#373637",
            "label-text": "#CCCCCC",
            "input-text": "#757575",
         },
      },
   },
   plugins: [],
}
