import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: ["electron-updater"] })],
  },

  preload: {
    plugins: [externalizeDepsPlugin()],
  },

  renderer: {
    root: "src/renderer",
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(
        "http://localhost:3000/api/v1"
      ),
    },
  },
});