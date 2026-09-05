---
"dropzone": patch
---

Send a single chunk for zero byte files instead of hanging. With `forceChunking` enabled, an empty file produced a chunk count of zero, so nothing was ever uploaded.
