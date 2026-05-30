import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Botones y áreas táctiles amplias para 65+
      minHeight: {
        touch: '3.5rem',
      },
    },
  },
  plugins: [],
}

export default config
