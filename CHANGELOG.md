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