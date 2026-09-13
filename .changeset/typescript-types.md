---
"dropzone": minor
---

Ship TypeScript types. The library is now written in TypeScript and the package carries its own declarations, so `dropzone` is typed from its own source.

If you installed `@types/dropzone`, uninstall it: it is stuck at `5.7.9` and describes the v5 API, so it will now conflict with — and is less accurate than — the types shipped here.

`Dropzone.prototype.Emitter` is now `Dropzone.Emitter`. It was undocumented and described in the source as being exposed for tests, so this is unlikely to affect you; if you reached for it, the class is in the same place under the shorter name.
