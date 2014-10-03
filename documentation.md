---
id: documentation
layout: default
title: Dropzone.js
---



<section markdown="1">


Configure
=========

There are two ways to configure dropzones.

The obvious way is to pass an options object when instantiating a dropzone
programmatically like in the previous [create dropzones programmatically](#create_dropzones_programmatically)
section.

But if you just have HTML elements with the `dropzone` class, then you don't
programmatically instantiate the objects, so you have to store the configuration
somewhere so Dropzone knows how to configure the dropzones when instantiating
them.

This is done with the `Dropzone.options` object.

{% highlight javascript %}
// "myAwesomeDropzone" is the camelized version of the HTML element's ID
Dropzone.options.myAwesomeDropzone = {
  paramName: "file", // The name that will be used to transfer the file
  maxFilesize: 2, // MB
  accept: function(file, done) {
    if (file.name == "justinbieber.jpg") {
      done("Naha, you don't.");
    }
    else { done(); }
  }
};
{% endhighlight %}


If you want to disable the auto discover behaviour of Dropzone, you can either disable
it on a per element basis, or in general:

{% highlight javascript %}
// Prevent Dropzone from auto discovering this element:
Dropzone.options.myAwesomeDropzone = false;
// This is useful when you want to create the
// Dropzone programmatically later

// Disable auto discover for all elements:
Dropzone.autoDiscover = false;
{% endhighlight %}


The valid options are:

| Option                  | Description
|-------------------------|-------------
| `url`                   | Has to be specified on elements other than form (or when the form doesn't have an `action` attribute)
| `method`                | Defaults to `"post"` and can be changed to `"put"` if necessary.
| `parallelUploads`       | How many file uploads to process in parallel (See the *Enqueuing file uploads* section for more info)
| `maxFilesize`           | in MB
| `paramName`             | The name of the file param that gets transferred. Can be a function returning a string. Defaults to `file`.
| `dictDefaultMessage`    | The message that gets displayed before any files are dropped. This is normally replaced by an image but defaults to "Drop files here to upload"
| `dictFallbackMessage`   | If the browser is not supported, the default message will be replaced with this text. Defaults to "Your browser does not support drag'n'drop file uploads."
| `dictFallbackText`      | This will be added before the file input files. If you provide a fallback element yourself, or if this option is `null` this will be ignored. Defaults to "Please use the fallback form below to upload your files like in the olden days."
| `previewsContainer`     | defines where to display the file previews – if `null` the Dropzone element is used. Can be a plain HTMLElement or a CSS selector. The element should have the `dropzone-previews` class so the previews are displayed properly.
| `clickable`             | If `true`, the dropzone element itself will be clickable. If a CSS selector or an HTML element the element will be used as clickable element. If `false` there won't be a click trigger.
| `acceptParam`           | If the Dropzone is `clickable` this option will be used as [`accept`](https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept) parameter on the hidden file input.
| `createImageThumbnails` |
| `maxThumbnailFilesize`  | in MB. When the filename exceeds this limit, the thumbnail will not be generated
| `thumbnailWidth`        |
| `thumbnailHeight`       |
| `init`                  | is a function that gets called when Dropzone is initialized. You can setup event listeners inside this function.
| `accept`                | is a function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File) and a `done` function as parameter. If the done function is invoked without a parameter, the file will be processed. If you pass an error message it will be displayed and the file will not be uploaded.
| `enqueueForUpload`      | When false, dropped files aren't uploaded automatically. See below for more info on enqueuing file uploads.
| `previewTemplate`       | is a string that contains the template used for each dropped image. Change it to fulfill your needs but make sure to properly provide all elements.
| `forceFallback`         | defaults to `false`. If `true` the fallback will be forced. This is very useful to test your server implementations first and make sure that everything works as expected without dropzone if you experience problems, and to test how your fallbacks will look.
| `fallback`              | is a function that gets called when the browser is not supported. The default implementation shows the fallback input field and adds a text.

> You can also overwrite all default event actions in the options. So if you provide the option `drop` you can overwrite the default `drop` event handler.
> *You should be familiar with the code if you do that because you can easily break the upload like this.*
> If you just want to do additional stuff, like adding a few classes here and there, **[listen to the events](#listen_to_events) instead**!


### Enqueuing file uploads

When a file gets added to the dropzone, it gets pushed to the `.filesQueue` Array.
Whenever this happens or a file upload has finished `.processQueue()` is called
which checks how many files are currently uploading, and if it's less than
`options.parallelUploads` `.processFile(file)` is called.

So if you set `enqueueForUpload` to false, can either call

```js
myDropzone.processFile(file);
```
if you want it to be processed immediately, or

```js
myDropzone.filesQueue.push(file);
myDropzone.processQueue();
```

if you want to use a queue.


## listen to events

Dropzone triggers events when processing files, to which you can register easily.

Example:

{% highlight javascript %}
// Already instantiated dropzones are accessible with `Dropzone.forElement(element)`
var myDropzone = Dropzone.forElement("#my-dropzone");

myDropzone.on("addedfile", function(file) {
  /* Maybe display some more file information on your page */
});

// Or from within a configuration:
Dropzone.options.myAwesomeDropzone = {
  init: function() {
    this.on("addedfile", function(file) { alert("Added file."); });
  }
};
{% endhighlight %}


Available events:

All of these receive the [event](https://developer.mozilla.org/en-US/docs/DOM/event) as first parameter:


| Parameter   | Description
|-------------|-------------
| `drop`      | The user dropped something onto the dropzone
| `dragstart` |
| `dragend`   |
| `dragenter` |
| `dragover`  |
| `dragleave` |


All of these receive the [file](https://developer.mozilla.org/en-US/docs/DOM/File) as the first parameter:

| Parameter         | Description
|-------------------|-------------
| `addedfile`       | 
| `removedfile`     | Called whenever a file is removed from the list. You can listen to this and delete the file from your server if you want to.
| `selectedfiles`   | Receives an array of files and gets called whenever files are dropped or selected.
| `thumbnail`       | When the thumbnail has been generated. Receives the [**dataUrl**](http://en.wikipedia.org/wiki/Data_URI_scheme) as second parameter.
| `error`           | An error occured. Receives the **errorMessage** as second parameter.
| `processingfile`  | When a file gets processed (since there is a queue not all files are processed immediately)
| `uploadprogress`  | Gets called periodically whenever the file upload progress changes.<br />Gets the **progress** parameter as second parameter which is a percentage (0-100) and the **bytesSent** parameter as third which is the number of the bytes that have been sent to the server.<br />When an upload finishes dropzone *ensures* that uploadprogress will be called with a percentage of 100 *at least* once.<br />**Warning:** This function can potentially be called with the same progress multiple times.
| `sending`         | Called just before the file is sent. Gets the xhr object and the [formData](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/FormData) objects as second and third parameters, so you can modify them (for example to add a CSRF token) or add additional data.
| `success`         | The file has been uploaded successfully. Gets the server response as second argument. (This event was called `finished` previously)
| `complete`        | Called when the upload was either successful or erroneous.
| `reset`           | Called when all files in the list are removed and the dropzone is reset to initial state.


## layout

The HTML that is generated for each file by dropzone looks like this (although you can change it with the `previewTemplate` option):

{% highlight html %}
<div class="preview file-preview">
  <div class="details">
    <div class="filename"><span></span></div>    
  </div>
  <div class="progress"><span class="upload"></span></div>
  <div class="success-mark"><span>Success</span></div>
  <div class="error-mark"><span>Error</span></div>
  <div class="error-message"><span></span></div>
</div>
{% endhighlight %}

`div.preview` gets the `processing` class when the file gets processed, `success` when the file got uploaded and `error` in case the file couldn't be uploaded. In the latter case, `div.error-message` will contain the text returned by the server.

See the installation section on how to add the stylesheet and spritemaps if you want your dropzone to look like the one on this page.


## dropzone methods

If you want to remove an added file from the dropzone, you can call `.removeFile(file)`.
This method also triggers the `removedfile` event.

Here's an example that would automatically remove a file when it's finished uploading:

{% highlight js %}
myDropzone.on("complete", function(file) {
  myDropzone.removeFile(file);
});
{% endhighlight %}

If you want to remove all files, simply use `.removeAllFiles()`. Files that are
in the process of being uploaded won't be removed.


If you do not need a dropzone anymore, just call `.disable()` on the object. This
will remove all event listeners on the element, and clear all file arrays. To
reenable a Dropzone use `.enable()`.

Tips
====

If your dropzone is rather square than a wide horizontal bar, you can add the class
`square` to your dropzone and it will create the default message in three lines
so it's not that wide.

If you do not want the default message at all (»Drop files to upload (or click)«), you can
put an element inside your dropzone element with the class `message` and dropzone
will not create the message for you.

Dropzone will submit any hidden fields you have in your dropzone form. So this
is an easy way to submit additional data. You can also use the `params` option.

If you want to add additional data to the file upload that has to be specific for
each file, you can register for the `sending` event:

{% highlight js %}
myDropzone.on("sending", function(file, xhr, formData) {
  formData.append("filesize", file.size); // Will send the filesize along with the file as POST data.
});
{% endhighlight %}

To access the preview html of a file, you can access `file.previewTemplate`. For
example:

{% highlight js %}
myDropzone.on("addedfile", function(file) {
  file.previewTemplate.click(function() { myDropzone.removeFile(file); });
});
{% endhighlight %}


If you want the whole body to be a Dropzone and display the files somewhere else
you can simply instantiate a Dropzone object for the body, and define the
`previewsContainer` option. The `previewsContainer` should have the
`dropzone-previews` or `dropzone` class to properly display the file previews.

{% highlight js %}
new Dropzone(document.body, {
  previewsContainer: ".dropzone-previews",
  // You probably don't want the whole body
  // to be clickable to select files
  clickable: false
});
{% endhighlight %}



I'll add more examples soon (How to add delete/download buttons when an upload finished,
how to add file previews on your own, etc...). In the meantime you can look at
the [github wiki](https://github.com/enyo/dropzone/wiki) for some information.

Don't hesitate to create an issue on github if you're stuck or think a feature
is missing.

</section>

