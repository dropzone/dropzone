---
"dropzone": patch
---

Coerce `chunkSize` to a number before computing chunk boundaries. When the option arrived as a string, every chunk after the first was sliced from the wrong offset and the uploaded file was silently corrupted.
