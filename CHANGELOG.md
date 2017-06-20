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

- Add support for browser image resizing! Yes, really. The new options are: `resizeWidth`, `resizeHeight`, `resizeMimeType` and `resizeQuality`.
  Thanks a lot to [MD Systems](https://www.md-systems.ch/) for donating the money to make this a reality. 
- Fix IE11 issue with `options.timeout`
- Resolve an issue that occurs in the iOS squashed image fix, where some transparent PNGs are stretched inaccurately

## 4.4.0

- Add `options.timeout`

## 4.3.0

Added Changelog. Sorry that this didn't happen sooner.