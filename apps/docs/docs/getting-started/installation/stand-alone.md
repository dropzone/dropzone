---
description: Simply download the files
---

# Stand-alone file

I don't recommend this option, because it is hard to maintain, but sometimes you just have a small project that you don't want to spend any unnecessary time on, and using the stand-alone `.js` files is fine for you.

Instead of having to download the files yourself, you can directly link to the unpkg host like this:

```html
<script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/dropzone@5/dist/min/dropzone.min.css" type="text/css" />
```

Dropzone is now active and available as `window.Dropzone`.

:::info

Note that the imported css file is optional.&#x20;

:::

### Dropzone v6

Dropzone has dropped Internet Explorer support in version 6, which is still in beta this point. If you already want to use a much lighter script (46kB vs 115kB) and don't care about Internet Explorer support, you can already opt into it like this:

```html
<script src="https://unpkg.com/dropzone@6.0.0-beta.1/dist/dropzone-min.js"></script>
<link href="https://unpkg.com/dropzone@6.0.0-beta.1/dist/dropzone.css" rel="stylesheet" type="text/css" />
```

If you do, please make sure to check the [CHANGELOG](https://github.com/dropzone/dropzone/blob/main/CHANGELOG.md) to make sure the breaking changes don't affect you.
