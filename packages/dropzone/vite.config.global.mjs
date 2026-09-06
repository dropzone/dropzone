import { defineConfig } from "vite";
import { resolve } from "node:path";

// Standalone build: dist/dropzone-min.js, loaded directly via a script tag.
//
// src/dropzone.js exports Dropzone both as the default and as a named export.
// Bundling it directly as an IIFE would make the global a namespace object --
// {Dropzone, default} -- so `new Dropzone(...)` would throw. This virtual entry
// collapses the two exports into the single global that script-tag users expect.
const ENTRY_ID = "virtual:dropzone-global";
const RESOLVED_ENTRY_ID = "\0" + ENTRY_ID;

const globalEntry = {
  name: "dropzone-global-entry",
  resolveId: (id) => (id === ENTRY_ID ? RESOLVED_ENTRY_ID : null),
  load: (id) =>
    id === RESOLVED_ENTRY_ID
      ? `import Dropzone from ${JSON.stringify(resolve("src/dropzone.js"))};` +
        `window.Dropzone = Dropzone;`
      : null,
};

// Everything is bundled here (a <script> tag cannot resolve a bare import).
// emptyOutDir is off because vite.config.mjs runs first and owns cleaning.
export default defineConfig({
  plugins: [globalEntry],
  build: {
    target: "es2017",
    outDir: "dist",
    emptyOutDir: false,
    minify: true,
    sourcemap: true,
    rollupOptions: {
      input: ENTRY_ID,
      output: { format: "iife", entryFileNames: "dropzone-min.js" },
    },
  },
});
