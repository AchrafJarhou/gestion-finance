import daisyui from "daisyui";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-poppins)",
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
        ],
      },
    },
  },
  plugins: [daisyui],
  daisyui: { themes: ["light", "dark", "cupcake"] },
};
