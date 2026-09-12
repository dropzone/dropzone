---
"dropzone": patch
---

Drop the `sass` dependency. The stylesheets are plain CSS now, and `dist/dropzone.css` and `dist/basic.css` are unchanged in what they do: the output was compared declaration by declaration, and every difference is a value-level equivalence the minifier applies, such as `padding: 20px 20px` collapsing to `padding: 20px`.

This only affects you if you were importing `dropzone/src/dropzone.scss` directly rather than the built CSS. Import `dropzone/src/dropzone.css` instead, or the compiled `dropzone/dist/dropzone.css`.
