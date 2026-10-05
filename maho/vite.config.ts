import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 親リポジトリ (Next.js) の postcss.config.mjs を拾わないよう切り離す
  css: { postcss: { plugins: [] } },
});
