import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: new URL("./index.html", import.meta.url).pathname,
        dashboardTeste: new URL("./dashboard-teste.html", import.meta.url).pathname,
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5175,
  },
});
