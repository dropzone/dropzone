import { defineConfig } from "vite";
import { playwright } from "@vitest/browser-playwright";

// Bundler-facing builds: dist/dropzone.js (CJS) and dist/dropzone.mjs (ESM).
//
// The source's highest syntax level is `async` (ES2017), so this target needs
// no down-levelling at all. There are no runtime dependencies to externalise:
// the only one there was, just-extend, now lives in src/extend.ts.
export default defineConfig({
  build: {
    target: "es2017",
    outDir: "dist",
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    lib: {
      entry: "src/dropzone.ts",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "dropzone.mjs" : "dropzone.js"),
    },
    rollupOptions: {
      output: {
        // Keeps both `require("dropzone").Dropzone` and `.default` working.
        exports: "named",
      },
    },
  },

  // Tests run against src/ in a real browser: Dropzone is a drag-and-drop DOM
  // library, and sharing this config means the `?raw` template import resolves
  // exactly as it does in the build.
  test: {
    globals: true,
    include: ["test/unit-tests/*.js"],
    exclude: ["test/unit-tests/utils.js"], // shared helper, not a spec
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      headless: true,
    },

    coverage: {
      provider: "v8",
      // Without this, only files a test happened to import are counted, so a
      // module nothing reaches would quietly improve the percentage by being
      // absent rather than being reported as uncovered.
      include: ["src/**/*.ts"],
      reporter: ["text", "html", "json", "json-summary", "lcov"],
      reportsDirectory: "coverage",
    },
  },
});
