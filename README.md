<img alt="Dropzone.js" src="https://raw.githubusercontent.com/dropzone/dropzone/assets/github-logo.svg" />

[![Test and Release](https://github.com/dropzone/dropzone/actions/workflows/test-and-release.yml/badge.svg)](https://github.com/dropzone/dropzone/actions/workflows/test-and-release.yml)

Dropzone is a JavaScript library that turns any HTML element into a dropzone.
This means that a user can drag and drop a file onto it, and Dropzone will
display file previews and upload progress, and handle the upload for you via
XHR.

It's fully configurable, can be styled according to your needs and is trusted by
thousands.

<div align="center">
  <img width="674" alt="Dropzone Screenshot" src="https://user-images.githubusercontent.com/133277/138495095-b026cc5c-9458-4e0b-8066-d8a9d0f7e72a.png">
</div>

## Quickstart

Install:

```bash
$ npm install --save dropzone
# or with yarn:
$ yarn add dropzone
```

Use as **ES6 module** (recommended):

```js
import { Dropzone } from "dropzone";
const dropzone = new Dropzone("div#myId", { url: "/file/post" });
```

or use as **CommonJS module**:

```js
const { Dropzone } = require("dropzone");
const dropzone = new Dropzone("div#myId", { url: "/file/post" });
```

[👉 Checkout our example implementations for different
bundlers](https://github.com/dropzone/dropzone-examples)

## Not using a package manager or bundler?

Use the standalone files like this:

```html
<script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>
<link
  rel="stylesheet"
  href="https://unpkg.com/dropzone@5/dist/min/dropzone.min.css"
  type="text/css"
/>

<div class="my-dropzone"></div>

<script>
  // Dropzone has been added as a global variable.
  const dropzone = new Dropzone("div.my-dropzone", { url: "/file/post" });
</script>
```

---

- [📚 Full documentation](https://docs.dropzone.dev)
- [⚙️ `src/options.js`](https://github.com/dropzone/dropzone/blob/main/src/options.js)
  for all available options

---

> ⚠️ **NOTE**: We are currently moving away from IE support to make the library
> more lightweight. If you don't care about IE but about size, you can already
> opt into `6.0.0-beta.1`. Please make sure to pin the specific version since
> parts of the API might change slightly. You can always read about the changes
> in the [`CHANGELOG`](./CHANGELOG.md) file.

## Community

If you need support please use the [discussions section][discussions] or
[stackoverflow][so] with the `dropzone.js` tag and **not** the GitHub issues
tracker. Only post an issue here if you think you discovered a bug.

If you have a feature request or want to discuss something, please use the
[discussions][] as well.

[discussions]: https://github.com/dropzone/dropzone/discussions
[so]: https://stackoverflow.com/questions/tagged/dropzone.js

> ⚠️ **Please read the [contributing guidelines](CONTRIBUTING.md) before you
> start working on Dropzone!**

## Main features ✅

- Beautiful by default
- Image thumbnail previews. Simply register the callback `thumbnail(file, data)`
  and display the image wherever you like
- High-DPI screen support
- Multiple files and synchronous uploads
- Progress updates
- Support for large files
  - Chunked uploads (upload large files in smaller chunks)
- Support for Amazon S3 Multipart upload
- Complete theming. The look and feel of Dropzone is just the default theme. You
  can define everything yourself by overwriting the default event listeners.
- Browser image resizing (resize the images before you upload them to your
  server)
- Well tested

# MIT License

See LICENSE file
