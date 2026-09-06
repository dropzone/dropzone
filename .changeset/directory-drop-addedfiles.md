---
"dropzone": minor
---

`addedfiles` now reports the files found inside a dropped folder. It previously received `e.dataTransfer.files`, which holds the folder entries rather than their contents, so anyone counting dropped files got the wrong answer for folders.

**This changes when the event fires.** Reading a folder is asynchronous, so on browsers that support folder drops — all of them — `addedfiles` is now emitted once the walk finishes, after the individual `addedfile` events, instead of synchronously at the end of the drop handler. Listeners still receive the event; only the timing moves.

Also adds an `emptyfolder` event, emitted with the folder's path when a dropped folder turns out to contain nothing at all.
