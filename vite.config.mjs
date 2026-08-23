import { defineConfig } from "vite";

// Bundler-facing builds: dist/dropzone.js (CJS) and dist/dropzone.mjs (ESM).
//
// The source's highest syntax level is `async` (ES2017), so this target needs
// no down-levelling at all. Runtime dependencies stay external here so that
// consumers can dedupe them; the standalone build bundles them instead.
export default defineConfig({
  build: {
    target: "es2017",
    outDir: "dist",
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    lib: {
      entry: "src/dropzone.js",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "dropzone.mjs" : "dropzone.js"),
    },
    rollupOptions: {
      external: ["just-extend"],
      output: {
        // Keeps both `require("dropzone").Dropzone` and `.default` working.
        exports: "named",
      },
    },
  },
});
