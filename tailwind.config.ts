import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Переконайтесь, що цей рядок є
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Цей рядок каже Tailwind'у: "Коли я пишу font-pixel, шукай змінну --font-pixel"
        pixel: ['var(--font-pixel)', 'monospace'], 
      },
    },
  },
  plugins: [],
};
export default config;