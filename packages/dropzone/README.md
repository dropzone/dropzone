# Dropzone

Dropzone is a JavaScript library that turns any HTML element into a dropzone.
This means that a user can drag and drop a file onto it, and Dropzone will
display file previews and upload progress, and handle the upload for you via
XHR.

```bash
npm install dropzone
# or
pnpm add dropzone
```

```js
import { Dropzone } from "dropzone";

const dropzone = new Dropzone("div#myId", { url: "/file/post" });
```

- [Documentation](https://www.dropzone.dev/docs)
- [`src/options.js`](./src/options.js) for every available option
- [Changelog](./CHANGELOG.md)

Development happens in the [dropzone monorepo](https://github.com/dropzone/dropzone);
this package lives in `packages/dropzone`. See the repository README for how to
build and test it.

> **NOTE**: Dropzone 6 does not support Internet Explorer. If you still need it,
> use `5.9.3`.

## MIT License

See [LICENSE](https://github.com/dropzone/dropzone/blob/main/LICENSE).
