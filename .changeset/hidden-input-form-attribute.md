---
"dropzone": patch
---

Associate the hidden file input with its form. The input is appended to `hiddenInputContainer` (the body by default), so it sits outside the form it belongs to and several dropzones on one page produce indistinguishable inputs. It now carries a `form` attribute when the dropzone is a form, or sits inside one, and that form has an id. The input has no `name`, so this does not change what a native submit sends — but it does mean the input now appears in `form.elements`.
