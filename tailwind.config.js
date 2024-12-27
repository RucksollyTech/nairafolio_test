/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#014148",
        border: {
          DEFAULT: "#D7D7D7",
          100: "#DCDCDC",
          200: "#0000000A"
        },
        bg:"#F5F5F5",
        secondary: {
          DEFAULT: "#C5E99F",
          100: "#00A651",
        },
        black: {
          DEFAULT: "#000",
          100: "#171717",
          200: "#586576"
        },
        muted: {
          DEFAULT: "#747474",
          100: "#BBBBBB",
          200: "#707070",
          300: "#4D4D4D"
        },
      },
      boxShadow: {
        'custom': '0px 4px 14px 0px #000000',
        "card": '0px 36px 22px #000026',
      },
      dropShadow:{
        'card': '0px 36px 22px #000026',
      },
      background: {
        'custom-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 16.26%)',
      },
      fontFamily: {
        psans: ["GeneralSans-Variable", "sans-serif"],
        pitalic: ["GeneralSans-VariableItalic", "sans-serif"],
        pregular: ["GeneralSans-Regular", "sans-serif"],
        psemibold: ["GeneralSans-Semibold", "sans-serif"],
        pmedium: ["GeneralSans-Medium", "sans-serif"],
        plight: ["GeneralSans-Light", "sans-serif"],
        pinter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

// background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 16.26%);
