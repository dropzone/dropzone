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

Written in TypeScript, and the types ship with the package. There is no
`@types/dropzone` to install — remove it if you have it, since it stopped at
`5.7.9` and describes the v5 API.

```ts
import type { DropzoneFile, DropzoneOptions } from "dropzone";
```

- [Documentation](https://www.dropzone.dev/docs)
- [`src/options.ts`](./src/options.ts) for every available option
- [Changelog](./CHANGELOG.md)

Development happens in the [dropzone monorepo](https://github.com/enyo/dropzone);
this package lives in `packages/dropzone`. See the repository README for how to
build and test it.

> **NOTE**: Dropzone 6 does not support Internet Explorer. If you still need it,
> use `5.9.3`.

## MIT License

See [LICENSE](https://github.com/enyo/dropzone/blob/main/LICENSE).
