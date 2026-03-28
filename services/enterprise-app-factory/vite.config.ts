import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: process.env.AUTOMIND_APP_FACTORY_API_ORIGIN ?? "http://127.0.0.1:3102",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist/client",
  },
});
