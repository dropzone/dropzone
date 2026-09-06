# 💅 Theming

If you want to theme your Dropzone to look fully customized, in most cases you can simply replace the preview HTML template, adapt your CSS, and maybe create a few additional event listeners.

It's covered in the Layout section.

[layout.md](basics/layout.md)

You will go very far with this approach. As an example, I created an example where I made Dropzone look and feel exactly the way jQuery File Uploader does with a few lines of configuration code. [Check it out!](https://www.dropzone.dev/bootstrap.html)

As you can see, the biggest change is the `previewTemplate`. I then added a few additional event listeners to make it look exactly like the reference.

## Completely change the way Dropzone is displayed

Dropzone itself sets up a lot of event listeners when a Dropzone is created, that handle all your UI. They do stuff like: create a new HTML element, add the `<img>`element when provided with image data (with the `thumbnail` event), update the progress bar when the `uploadprogress` event fires, show a checkmark when the `success` event fires, etc…

_Everything_ visual is done in those event handlers. If you would overwrite all of them with empty functions, Dropzone would still be fully functional, but wouldn’t display the dropped files anymore.

> If you like the default look of Dropzone, but would just like to add a few bells and whistles here and there, you should just [add additional event listeners](events.md) instead.

Overwriting the default event listeners, and creating your own, custom Dropzone, would look something like this:

```javascript
// This is an example of completely disabling Dropzone's default behavior.
// Do *not* use this unless you really know what you are doing.
Dropzone.myDropzone.options = {
  previewTemplate: document.querySelector('#template-container').innerHTML,
  // Specifing an event as an configuration option overwrites the default
  // `addedfile` event handler.
  addedfile: function(file) {
    file.previewElement = Dropzone.createElement(this.options.previewTemplate);
    // Now attach this new element some where in your page
  },
  thumbnail: function(file, dataUrl) {
    // Display the image in your file.previewElement
  },
  uploadprogress: function(file, progress, bytesSent) {
    // Display the progress
  }
  // etc...
};
```

Obviously this lacks the actual implementation. Look at the source to see how Dropzone does it internally.

You should use this option if you don’t need any of the default Dropzone UI, but are only interested in Dropzone for it’s event handlers, file upload and drag’n’drop functionality.
