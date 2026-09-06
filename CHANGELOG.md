## 6.2.0

### Minor Changes

- [#2351](https://github.com/dropzone/dropzone/pull/2351) [`ee82380`](https://github.com/dropzone/dropzone/commit/ee82380a1813a4d82c932c5e6a3516ce29548216) Thanks [@enyo](https://github.com/enyo)! - `addedfiles` now reports the files found inside a dropped folder. It previously received `e.dataTransfer.files`, which holds the folder entries rather than their contents, so anyone counting dropped files got the wrong answer for folders.

  **This changes when the event fires.** Reading a folder is asynchronous, so on browsers that support folder drops — all of them — `addedfiles` is now emitted once the walk finishes, after the individual `addedfile` events, instead of synchronously at the end of the drop handler. Listeners still receive the event; only the timing moves.

  Also adds an `emptyfolder` event, emitted with the folder's path when a dropped folder turns out to contain nothing at all.

- [#2348](https://github.com/dropzone/dropzone/pull/2348) [`f0697ee`](https://github.com/dropzone/dropzone/commit/f0697eef079496980c05cb13fd804caca4328f75) Thanks [@enyo](https://github.com/enyo)! - `parallelChunkUploads: true` now starts at most `parallelUploads` chunks at a time rather than every chunk of the file at once. Pass a number to set a different limit, or `Infinity` to restore the previous behaviour.

- [#2349](https://github.com/dropzone/dropzone/pull/2349) [`8a8b449`](https://github.com/dropzone/dropzone/commit/8a8b449619c080172d36183d1129a5037b459f39) Thanks [@enyo](https://github.com/enyo)! - Add `resizeTransparencyFill`, the color shown through transparent parts of a resized image. A transparent PNG resized to `image/jpeg` previously came out with black where it used to be see-through; set this to `"#fff"`, or any CSS color, for a background instead. Defaults to `null`, which keeps the current behavior.

### Patch Changes

- [`d3a9221`](https://github.com/dropzone/dropzone/commit/d3a922199d56b73be1ae71f1834c24066aba40fd) Thanks [@enyo](https://github.com/enyo)! - Reword the default `dictMaxFilesExceeded` message from "You can not upload any more files." to "You cannot upload any more files."

- [#2350](https://github.com/dropzone/dropzone/pull/2350) [`9b5015b`](https://github.com/dropzone/dropzone/commit/9b5015b7d4143ec1c482984a20ec6e87888702d4) Thanks [@enyo](https://github.com/enyo)! - Give the hidden file input an `aria-label`, so accessibility auditors stop reporting it as an unlabelled input. This does not change anything for screen reader users: browsers leave `visibility: hidden` elements out of the accessibility tree entirely, and the `.dz-button` carrying `dictDefaultMessage` remains the control they interact with.

- [#2352](https://github.com/dropzone/dropzone/pull/2352) [`b24f8cc`](https://github.com/dropzone/dropzone/commit/b24f8cc594530ed4d192dec5de7ce510207eb7cb) Thanks [@enyo](https://github.com/enyo)! - Associate the hidden file input with its form. The input is appended to `hiddenInputContainer` (the body by default), so it sits outside the form it belongs to and several dropzones on one page produce indistinguishable inputs. It now carries a `form` attribute when the dropzone is a form, or sits inside one, and that form has an id. The input has no `name`, so this does not change what a native submit sends — but it does mean the input now appears in `form.elements`.

- [`4e13aab`](https://github.com/dropzone/dropzone/commit/4e13aabb7df94c8a24a4d232b82b2ad12ed8dd47) Thanks [@enyo](https://github.com/enyo)! - Vendor `just-extend` into the source and drop the dependency. Dropzone now installs with no dependencies at all; the option merging behaviour is unchanged.

## 6.1.0

### Minor Changes

- [`b32d746`](https://github.com/dropzone/dropzone/commit/b32d7465c1dbde4891d124b4005089c64c13b35b) Thanks [@filip-kinsky](https://github.com/filip-kinsky)! - Emit an `error` instead of a broken thumbnail when a file claims an image type but cannot be decoded. The new `dictThumbnailError` option holds the message.

### Patch Changes

- [`94a0656`](https://github.com/dropzone/dropzone/commit/94a065670e6dee3b748e5a47eca66d308bfb4274) Thanks [@AJHoeh](https://github.com/AJHoeh)! - Coerce `chunkSize` to a number before computing chunk boundaries. When the option arrived as a string, every chunk after the first was sliced from the wrong offset and the uploaded file was silently corrupted.

- [`85c5c2a`](https://github.com/dropzone/dropzone/commit/85c5c2ac23eee55b0e1f924a4ffb75ae2181f44d) Thanks [@enyo](https://github.com/enyo)! - Stop preview thumbnails from being dragged back into the dropzone, which added the same file a second time under a generated name.

- [`4762df8`](https://github.com/dropzone/dropzone/commit/4762df8c329e3862c43bb8b9a3cbd4c083a4bc1f) Thanks [@Forceu](https://github.com/Forceu)! - Send a single chunk for zero byte files instead of hanging. With `forceChunking` enabled, an empty file produced a chunk count of zero, so nothing was ever uploaded.

## 6.0.0

The 6.0.0 line is now stable. There are no API changes since `6.0.0-beta.2` —
see the `6.0.0-beta.1` notes below for the breaking changes in this major
version.

- `@swc/helpers` is no longer a dependency. `just-extend` is now the only one.
- The bundles are considerably smaller, since they are no longer transpiled for
  browsers that 6.0.0 had already stopped supporting.

## 6.0.0-beta.2

- Add `binaryBody` support (thanks to @patrickbussmann and @meg1502).
  - This adds full support for AWS S3 Multipart Upload.
  - There is an example setup for this now in `test/test-sites/2-integrations`.

## 6.0.0-beta.1

### Breaking

- Dropzone is dropping IE support! If you still need to support IE, please use
  `5.9.3`. You can download it here:
  https://github.com/dropzone/dropzone/releases/download/v5.9.3/dist.zip
- `Dropzone.autoDiscover` has been removed! If you want to auto discover your
  elements, invoke `Dropzone.discover()` after your HTML has loaded and it will
  do the same.
- The `dropzone-amd-module` files have been removed. There is now a
  `dropzone.js` and a `dropzone.mjs` in the dist folder.
- The `min/` folder has been removed. `dropzone.min.js` is now the only
  file that is minimized.
- Remove `Dropzone.extend` and replace by the `just-extend` package.
- There is no more `Dropzone.version`.

## 5.9.3

- Fix incorrect resize method used for creating thumbnails of existing files
  (thanks to @gplwhite)

## 5.9.2

- Handle `xhr.readyState` in the `submitRequest` function and don't attempt to
  send if it's not `1` (OPENED). (thanks to @bobbysmith007)

## 5.9.1

- Fix the way upload progress is calculated when using chunked uploads. (thanks
  to @ckovey)

## 5.9.0

- Properly handle when timeout is null or 0
- Make the default of timeout null

## 5.8.1

- Fix custom event polyfill for IE11
- Fix build to use ES5 instead of ES6, which was broken due to webpack upgrade.
  (thanks to @fukayatsu)

## 5.8.0

- Dropzone now also triggers custom events on the DOM element. The custom events
  are the same as the events you can listen on with Dropzone but start with
  `dropzone:`. (thanks to @1cg)
- Moved the `./src/options.js` previewTemplate in its own
  `preview-template.html` file.
- Switched to yarn as the primary package manager (shouldn't affect anybody that
  is not working Dropzone itself).

## 5.7.6

- Revert `dist/min/*.css` files to be named `dist/min/*.min.css`.
- Setup bower releases.

## 5.7.5

- Rename `blacklistedBrowsers` to `blockedBrowsers` (but still accept
  `blacklistedBrowsers` for legacy).
- Add automatic trigger for packagist deployment.
- Fix links in `package.json`.

## 5.7.4

- Prevent hidden input field from getting focus (thanks to @sinedied)
- Fix documentation of `maxFilesize` (thanks to @alxndr-w)
- Fix build issues so the UMD module can be imported properly

## 5.7.3 (retracted)

- Add `disablePreviews` option.
- Fix IE problems with Symbols.
- **WARNING**: This release had issues because the .js files couldn't be
  imported as AMD/CommonJS packages properly. The standalone version worked fine
  though. I have retracted this version from npm but have left the release on
  GitHub.

## 5.7.2

- Base the calculation of the chunks to send on the transformed files
- Properly display seconds (instead of ms) in error message when timeout is
  reached
- Properly handle it when `options.method` is a function (there was a bug, which
  always assumed that it was a String) (thanks to @almdac)
- Fix orientation on devices that already handle it properly (thanks to @nosegrind)
- Handle additionalParams when they are an Array the way it's expected (thanks to @wiz78)
- Check for `string` in error message type instead of `String` (thanks to @RuQuentin)

## 5.7.1

- Fix issue with IE (thanks to @Bjego)

## 5.7.0

- Cleanup the SVGs used to remove IDs and sketch attributes
  Since SVGs are duplicated this resulted in duplicate IDs being used.
- Add a dedicated `displayExistingFile` method to make it easier to display
  server files.
- Fix an error where chunked uploads don't work as expected when transforming
  files before uploading.
- Make the default text a button so it's discoverable by keyboard.

## 5.6.1

- Re-released due to missing javascript files
- Removes `npm` dependency that got added by mistake

## 5.6.0

- Timeout now generates an error (thanks to @mmollick)
- Fix duplicate iteration of error processing (#159 thanks @darkland)
- Fixed bootstrap example (@thanks to @polosatus)
- The `addedfiles` event now triggers _after_ each individual `addedfile` event
  when dragging files into the dropzone, which is the same behavior as when
  clicking it.

## 5.5.0

- Correct photo orientation before uploading (if enabled) (thanks to @nosegrind)
- Remove a potential memory leak in some browsers by keeping a reference to `xhr` inside the individual
  chunk objects (thanks to @clayton2)
- Allow HTML in the remove links (thanks to @christianklemp)
- `hiddenInputContainer` can now be an `HtmlElement` in addition to a selector String (thanks to @WAmeling)
- Fix default values on website (since the last deployment, the default values all stated `null`)

## 5.4.0

- Fix IE11 issue when dropping files

## 5.3.1

- Fix broken npm release of 5.3.0

## 5.3.0

- Add `dictUploadCanceled` option (thanks to @Fohlen)
- Fix issue with drag'n'drop on Safari and IE10 (thanks to @taylorryan)
- Fix issues with resizing if SVG files are dropped (thanks to @saschagros)

## 5.2.0

- **Migrated from coffeescript to ES6!**
- **Added chunked file uploading!** The highly requested chunked uploads are now available. Checkout the
  `chunking` option documentation for more information.
- Fixed a faulty `console.warning` (should be `console.warn`)
- If an input field doesn't have a name, don't include it when sending the form (thanks to @remyj38)
- Opera on Windows Phone is now also blacklisted (thanks to @dracos1)
- If a custom preview element is used, it is now properly handled when it doesn't have a parent (thanks to @uNmAnNeR)

## 5.1.1

- Fix issue where showing files already on the server fails, due to the missing `file.upload.filename`
- Fix issue where `file.upload.filename` gets removed after the file uploaded completed
- Properly handle `arraybuffer` and `blob` responses

## 5.1.0

- Add possibility to translate file sizes. (#16 thanks to @lerarybak for that)
- Fix duplicate filenames in multiple file uploads (#15)
- The `renameFilename` option has been **deprecated**. Use `renameFile` instead
  (which also has a slightly different function signature)
- The `renameFile` option now stores the new name in `file.upload.filename` (#1)

## 5.0.1

- Add missing dist/ folder to npm.

## 5.0.0

- **Add support for browser image resizing!** Yes, really. The new options are: `resizeWidth`, `resizeHeight`, `resizeMimeType` and `resizeQuality`.
  Thanks a lot to [MD Systems](https://www.md-systems.ch/) for donating the money to make this a reality.
- Fix IE11 issue with `options.timeout`
- Resolve an issue that occurs in the iOS squashed image fix, where some transparent PNGs are stretched inaccurately

## 4.4.0

- Add `options.timeout`

## 4.3.0

Added Changelog. Sorry that this didn't happen sooner.
