import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // During local dev, requests to /api go to the local Express server.
      "/api": {
        target: "https://smart-log-analyzer-backend-87xk.vercel.app",
        changeOrigin: true,
      },
    },
  },
});
