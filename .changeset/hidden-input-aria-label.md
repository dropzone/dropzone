---
"dropzone": patch
---

Give the hidden file input an `aria-label`, so accessibility auditors stop reporting it as an unlabelled input. This does not change anything for screen reader users: browsers leave `visibility: hidden` elements out of the accessibility tree entirely, and the `.dz-button` carrying `dictDefaultMessage` remains the control they interact with.
