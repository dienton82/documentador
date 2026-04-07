
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["GFTGrotesk","ui-sans-serif","system-ui","sans-serif"],
        mono: ["ui-monospace","SFMono-Regular","Menlo","Monaco","Consolas","Liberation Mono","Courier New","monospace"]
      },
      colors: {
        bank: { blue: "#0033A0", sky: "#00AEEF" }
      },
      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,.08)"
      }
    },
  },
  plugins: [],
};
export default config;
