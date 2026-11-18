import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: "var(--primary)", accent: "var(--accent)", rose: "var(--rose)", surface: "var(--surface)" },
    },
  },
} satisfies Config;
