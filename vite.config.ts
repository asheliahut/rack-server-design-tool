import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
    // Optimized for Bun
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    // Bun optimizations
    target: "esnext",
    minify: "esbuild",
  },
  optimizeDeps: {
    // Force pre-bundling for better Bun compatibility
    include: ["react", "react-dom", "react-dnd", "react-dnd-html5-backend"],
  },
});
