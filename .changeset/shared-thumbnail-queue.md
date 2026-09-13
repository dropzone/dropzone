---
"dropzone": patch
---

Give each dropzone its own thumbnail queue. It lived on the prototype, so every dropzone on a page shared one: queuing a thumbnail on one was visible from the others, and they rendered from a single queue guarded by a single lock. Only pages with more than one dropzone were affected.
