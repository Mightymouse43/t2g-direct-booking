/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        't2g-navy':   '#1F3642',
        't2g-cloud':  '#F0F4F7',
        't2g-mist':   '#E5E8EF',
        't2g-slate':  '#47526B',
        't2g-teal':   '#2E8B8E',
        't2g-sand':   '#C4A96E',
        't2g-mustard':'#D4A017',
        't2g-green':  '#22C55E',
        't2g-white':  '#FFFFFF',
      },
      fontFamily: {
        heading:  ['Montserrat', 'sans-serif'],
        body:     ['Inter', 'sans-serif'],
        display:  ['Playfair Display', 'serif'],
      },
      fontSize: {
        'h1': ['60px', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['26px', { lineHeight: '1.3', fontWeight: '600' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionTimingFunction: {
        't2g': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}
