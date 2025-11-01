import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "",
  build: {
    minify: false, // 🔥 Desactiva minificación
    sourcemap: true, // 🧭 Genera sourcemaps para depurar
  },
});
