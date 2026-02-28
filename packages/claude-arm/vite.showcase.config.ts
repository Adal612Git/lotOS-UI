import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: resolve(packageRoot, "showcase"),
  server: {
    port: 4177,
    open: false,
  },
  build: {
    outDir: resolve(packageRoot, "showcase-dist"),
    emptyOutDir: true,
  },
});
