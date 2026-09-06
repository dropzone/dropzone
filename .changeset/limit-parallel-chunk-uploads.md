---
"dropzone": minor
---

`parallelChunkUploads: true` now starts at most `parallelUploads` chunks at a time rather than every chunk of the file at once. Pass a number to set a different limit, or `Infinity` to restore the previous behaviour.
