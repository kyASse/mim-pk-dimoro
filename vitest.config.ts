import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    testTimeout: 20000,
    hookTimeout: 20000,
    exclude: ["**/node_modules/**", "**/dist/**", "**/tests/**", "**/cypress/**", "**/.{idea,git,cache,output,temp}/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
