---
description: Create a form with various other input fields that also acts as a Dropzone.
---

# Combine form data with files

You want to have a normal form, that you can drop files in, and send the whole form, including the files, with the click of a button? Well, you're in luck. It requires a bit of configuration, but it's not difficult to do.

First off, you need to make sure that Dropzone won't auto process your queue and start uploading each file individually. This is done by setting these properties:

* `autoProcessQueue: false` Dropzone should wait for the user to click a button to upload
* `uploadMultiple: true` Dropzone should upload all files at once \(including the form data\) not all files individually
* `parallelUploads: 100` that means that they shouldn't be split up in chunks as well
* `maxFiles: 100` and this is to make sure that the user doesn't drop more files than allowed in one request.

This is basically everything you need to do. _Dropzone automatically submits all input fields inside a form that behaves as a Dropzone_.

## Show me the code

This is what a very simple HTML looks like:

```markup
<form id="upload-form" class="dropzone">
  <!-- this is were the previews should be shown. -->
  <div class="previews"></div>
  
  <!-- Now setup your input fields -->
  <input type="email" name="username" />
  <input type="password" name="password" />

  <button type="submit">Submit data and files!</button>
</form>
```

And now for the Dropzone configuration:

```javascript
Dropzone.options.uploadForm = { // The camelized version of the ID of the form element

  // The configuration we've talked about above
  autoProcessQueue: false,
  uploadMultiple: true,
  parallelUploads: 100,
  maxFiles: 100,

  // The setting up of the dropzone
  init: function() {
    var myDropzone = this;

    // First change the button to actually tell Dropzone to process the queue.
    this.element.querySelector("button[type=submit]").addEventListener("click", function(e) {
      // Make sure that the form isn't actually being sent.
      e.preventDefault();
      e.stopPropagation();
      myDropzone.processQueue();
    });

    // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
    // of the sending event because uploadMultiple is set to true.
    this.on("sendingmultiple", function() {
      // Gets triggered when the form is actually being sent.
      // Hide the success button or the complete form.
    });
    this.on("successmultiple", function(files, response) {
      // Gets triggered when the files have successfully been sent.
      // Redirect user or notify of success.
    });
    this.on("errormultiple", function(files, response) {
      // Gets triggered when there was an error sending the files.
      // Maybe show form again, and notify user of error
    });
  }
 
}
```

That's it.

