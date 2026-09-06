---
"dropzone": minor
---

Add `resizeTransparencyFill`, the colour shown through transparent parts of a resized image. A transparent PNG resized to `image/jpeg` previously came out with black where it used to be see-through; set this to `"#fff"`, or any CSS colour, for a background instead. Defaults to `null`, which keeps the current behaviour.
