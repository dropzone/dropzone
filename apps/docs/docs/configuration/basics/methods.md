# Methods

If you want to remove an added file from the dropzone, you can call `.removeFile(file)`. This method also triggers the `removedfile` event.

Here’s an example that would automatically remove a file when it’s finished uploading:

```javascript
myDropzone.on("complete", function(file) {
  myDropzone.removeFile(file);
});
```

If you want to remove all files, simply use `.removeAllFiles()`. Files that are in the process of being uploaded won’t be removed. If you want files that are currently uploading to be canceled, call `.removeAllFiles(true)` which will cancel the uploads.

If you have `autoProcessQueue` disabled, you’ll need to call `.processQueue()`yourself.

This can be useful if you want to display the files and let the user click an accept button to actually upload the file\(s\).

To access all files in the dropzone, use `myDropzone.files`.

To get

* all accepted files: `.getAcceptedFiles()`
* all rejected files: `.getRejectedFiles()`
* all queued files: `.getQueuedFiles()`
* all uploading files: `.getUploadingFiles()`

If you do not need a dropzone anymore, just call `.disable()` on the object. This will remove all event listeners on the element, and clear all file arrays. To reenable a Dropzone use `.enable()`.

If you don’t like the default browser modals for `confirm` calls, you can handle them yourself by overwriting `Dropzone.confirm`.

```javascript
Dropzone.confirm = function(question, accepted, rejected) {
  // Ask the question, and call accepted() or rejected() accordingly.
  // CAREFUL: rejected might not be defined. Do nothing in that case.
};
```

If you want Dropzone to display an image you have on your server, you can use:

```javascript
// callback and crossOrigin are optional
let mockFile = { name: "Filename", size: 12345 };
myDropzone.displayExistingFile(mockFile, 'https://image-url');
```

See the FAQ on [How to show files stored on server](https://github.com/dropzone/dropzone/discussions/1909).

