/**
 * Tailwind CSS v3 Konfiguration
 *
 * Diese Datei konfiguriert Tailwind CSS und DaisyUI.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // DaisyUI Themes
  },
};
