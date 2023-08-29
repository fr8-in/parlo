/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors:{
        primary:{
          DEFAULT: '#113261'
        },
        canvas: {
          DEFAULT: '#EEF7FF'
        },
        black:{
          40: 'rgba(0,0,0,0.4)',
          30: 'rgba(0,0,0,0.3)',
          20: 'rgba(0,0,0,0.2)',
          10: 'rgba(0,0,0,0.1)'
        },
        twhite:{
          40: 'rgba(255,255,255,0.4)',
          30: 'rgba(255,255,255,0.3)',
          20: 'rgba(255,255,255,0.2)',
          10: 'rgba(255,255,255,0.1)'
        }
      }
    },
  },
  plugins: [],
}
