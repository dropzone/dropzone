# Tips & Tricks

:::info

Checkout the [Discussions section on Github](https://github.com/dropzone/dropzone/discussions) for more content.

:::

If you do not want the default message at all \(»Drop files to upload \(or click\)«\), you can put an element inside your dropzone element with the class `dz-message` and dropzone will not create the message for you.

Dropzone will submit any hidden fields you have in your dropzone form. So this is an easy way to submit additional data. You can also use the `params` option.

Dropzone adds data to the `file` object you can use when events fire. You can access `file.width` and `file.height` if it’s an image, as well as `file.upload`which is an object containing: `progress` \(0-100\), `total` \(the total bytes\) and `bytesSent`.

If you want to add additional data to the file upload that has to be specific for each file, you can register for the [`sending`](https://www.dropzonejs.com/#event-sending) event:

```javascript
myDropzone.on("sending", function(file, xhr, formData) {
  // Will send the filesize along with the file as POST data.
  formData.append("filesize", file.size);
});
```

To access the preview html of a file, you can access `file.previewElement`. For example:

```javascript
myDropzone.on("addedfile", function(file) {
  file.previewElement.addEventListener("click", function() {
    myDropzone.removeFile(file);
  });
});
```

If you want the whole body to be a Dropzone and display the files somewhere else you can simply instantiate a Dropzone object for the body, and define the[`previewsContainer`](https://www.dropzonejs.com/#config-previewsContainer) option. The `previewsContainer` should have the`dropzone-previews` or `dropzone` class to properly display the file previews.

```javascript
new Dropzone(document.body, {
  previewsContainer: ".dropzone-previews",
  // You probably don't want the whole body
  // to be clickable to select files
  clickable: false
});
```

Look at the [gitlab wiki](https://gitlab.com/meno/dropzone/wikis/home) for more examples.

If you have any problems using Dropzone, please try to find help on [stackoverflow.com](https://stackoverflow.com/questions/tagged/dropzone.js) by using the `dropzone.js` tag. Only create an issue on GitLab when you think you found a bug or want to suggest a new feature.

