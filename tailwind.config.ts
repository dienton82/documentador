
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["GFTGrotesk","ui-sans-serif","system-ui","sans-serif"],
        mono: ["ui-monospace","SFMono-Regular","Menlo","Monaco","Consolas","Liberation Mono","Courier New","monospace"]
      },
      colors: {
        brand: { DEFAULT: "#5d5e60", dark: "#3a3b3d", light: "#8a8b8d" }
      },
      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,.08)"
      }
    },
  },
  plugins: [],
};
export default config;
