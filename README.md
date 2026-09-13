<img alt="Dropzone.js" src="https://raw.githubusercontent.com/enyo/dropzone/assets/github-logo.svg" />

[![CI](https://github.com/enyo/dropzone/actions/workflows/ci.yml/badge.svg)](https://github.com/enyo/dropzone/actions/workflows/ci.yml)

Dropzone is a JavaScript library that turns any HTML element into a dropzone.
This means that a user can drag and drop a file onto it, and Dropzone will
display file previews and upload progress, and handle the upload for you via
XHR.

It's fully configurable, can be styled according to your needs and is trusted by
thousands. It's written in TypeScript and ships its own types, so there's
nothing extra to install.

<div align="center">
  <img width="674" alt="Dropzone Screenshot" src="https://user-images.githubusercontent.com/133277/138495095-b026cc5c-9458-4e0b-8066-d8a9d0f7e72a.png">
</div>

## Quickstart

Install:

```bash
$ npm install dropzone
# or with pnpm:
$ pnpm add dropzone
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

## TypeScript

The types come with the package — there's no `@types/dropzone` to install, and
you should remove it if you have it: it stopped at `5.7.9` and describes the
v5 API.

```ts
import { Dropzone } from "dropzone";
import type { DropzoneFile, DropzoneOptions } from "dropzone";

const options: DropzoneOptions = { url: "/file/post", maxFilesize: 10 };
const dropzone = new Dropzone("div#myId", options);

// listener arguments are inferred from the event name
dropzone.on("addedfile", (file) => console.log(file.name, file.upload.uuid));
```

Every option is typed from the defaults it's declared with, so the two can't
drift, and the documentation on each one shows up on hover.

[👉 Checkout our example implementations for different
bundlers](https://github.com/dropzone/dropzone-examples)

## Not using a package manager or bundler?

Use the standalone files like this:

```html
<script src="https://unpkg.com/dropzone@6/dist/dropzone-min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/dropzone@6/dist/dropzone.css" type="text/css" />

<div class="my-dropzone"></div>

<script>
  // Dropzone has been added as a global variable.
  const dropzone = new Dropzone("div.my-dropzone", { url: "/file/post" });
</script>
```

---

- [📚 Full documentation](https://www.dropzone.dev/docs/)
- [⚙️ `src/options.ts`](https://github.com/enyo/dropzone/blob/main/packages/dropzone/src/options.ts)
  for all available options

---

> ⚠️ **NOTE**: Dropzone 6 does not support Internet Explorer. If you still need
> it, use `5.9.3`. See the [`CHANGELOG`](./CHANGELOG.md) for everything that
> changed in 6.0.0.

## Repository layout

This is a monorepo. It holds the library, the documentation and the website:

|                                          |                                            |
| ---------------------------------------- | ------------------------------------------ |
| [`packages/dropzone`](packages/dropzone) | the library published to npm as `dropzone` |
| [`apps/docs`](apps/docs)                 | the documentation, built with Docusaurus   |
| [`apps/website`](apps/website)           | www.dropzone.dev, built with SvelteKit     |

```bash
pnpm install

pnpm build          # the library and the docs
pnpm test           # the library's unit tests
pnpm test:e2e       # the library's browser tests
pnpm dev:docs       # the documentation, locally
pnpm dev:website    # the website, locally
```

### Building the deployable site

The website and the documentation are published together as one GitHub Pages
site: the website at the root, the documentation under `/docs`. One command
produces exactly what gets deployed, in `_site/`:

```bash
pnpm build:site
```

CI runs [the same script](scripts/build-site.sh), so what you get locally is
what ships. It builds each half with its own toolchain and combines them, which
means there is no manual copying step to remember or get wrong.

## Community

If you need support please use the [discussions section][discussions] or
[stackoverflow][so] with the `dropzone.js` tag and **not** the GitHub issues
tracker. Only post an issue here if you think you discovered a bug.

If you have a feature request or want to discuss something, please use the
[discussions][] as well.

[discussions]: https://github.com/enyo/dropzone/discussions
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

See the [LICENSE](https://github.com/enyo/dropzone/blob/main/LICENSE) file
