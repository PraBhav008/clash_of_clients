/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Focused 2-3 Color Professional Palette:
        // 1. Obsidian & Deep Charcoal (Base)
        // 2. Imperial Bronze / Muted Warm Gold (Primary Accent)
        // 3. Crisp Slate / Platinum (Neutral Text & Structure)
        brand: {
          bg: '#0A0D14',        // Deepest charcoal base
          surface: '#101522',   // Secondary container
          card: '#151C2C',      // Card surface
          cardHover: '#1B2438', // Hover state
          border: '#232D42',    // Hairline border
          borderLight: '#2F3C56',
        },
        gold: {
          light: '#ECC968',
          DEFAULT: '#C9A038',  // Refined antique gold / bronze
          dark: '#967420',
          muted: 'rgba(201, 160, 56, 0.12)',
        },
        accent: {
          green: '#10B981',    // Minimal functional status
          red: '#EF4444',      // Minimal functional overdue
          sky: '#38BDF8',      // Minimal info
        }
      },
      boxShadow: {
        'brand-card': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'gold-glow': '0 0 16px rgba(201, 160, 56, 0.18)',
      }
    },
  },
  plugins: [],
}
