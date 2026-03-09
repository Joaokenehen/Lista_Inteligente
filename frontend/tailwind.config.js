/** @type {import('tailwindcss').Config} */
module.exports = {
  // MUITO IMPORTANTE: Verifique se os caminhos batem com a sua estrutura
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}