# Dropzone.js Version 1.2.2

Dropzone.js is a light weight JavaScript library for jQuery that turns an HTML element into a dropzone.
This means that a user can drag and drop a file onto it, and the file gets uploaded to the server via AJAX.

It is written as a [component](https://github.com/component/component).

![Screenshot](http://i.imgur.com/jpc80.png)

## Main features

- Image thumbnail previews. Simply register the callback `thumbnail(file, data)` and display the image wherever you like
- Multiple files and synchronous uploads
- Progress updates
- Support for large files

## Documentation

For the full documentation and installation please visit www.dropzonejs.com

## Usage

Implicit creation:

```html
<form id="my-awesome-dropzone" action="/target" class="dropzone"></form>
```

That's it. Really!

Dropzone will automatically attach to it, and handle file drops.

Want more control? You can configure dropzones like this:

```js
// "myAwesomeDropzone" is the camelized version of the ID of your HTML element
Dropzone.options.myAwesomeDropzone = { maxFilesize: 1 };
```

...or instantiate dropzone manually like this:

```js
$("div#my-zone").dropzone({ ...configuration... });
```

> Note that dropzones don't have to be forms. But if you choose another element you have to pass the `url` parameter in the options.

For configuration options please look at the [source line 48](https://github.com/enyo/dropzone/blob/master/src/dropzone.coffee#L48).



### Register for events

I use [emitter](https://github.com/component/emitter) to manage events. If you want to register to some event you can do so on the `dropzone` object itself:

```js
var myDropzone = $("div#my-zone").dropzone({ ...configuration... });
myDropzone.on("error", function(file, message) { alert(message); });
```

For a list of all events, please look at the [source line 30](https://github.com/enyo/dropzone/blob/master/src/dropzone.coffee#L30).


## Browser support

- Chrome 7+
- Firefox 4+
- IE 10+
- Opera 12+
- Safari 5+

For all the other browsers, dropzone provides an oldschool file input fallback.

## Why another library?

I realize that there [are](http://valums.com/ajax-upload/) [already](http://tutorialzine.com/2011/09/html5-file-upload-jquery-php/) [other](http://code.google.com/p/html5uploader/) [libraries](http://blueimp.github.com/jQuery-File-Upload/) out there but the reason I decided to write my own are the following:

- I didn't want it to be too big, and to cumbersome to dive into.
- I want to design my own elements. I only want to register callbacks so I can update my elements accordingly.
- Big files should get uploaded without a problem.
- I wanted a callback for image previews, that don't kill the browser if too many too big images are viewed.
- I want to use the latest API of browsers. I don't care if it falls back to the normal upload form if the browser is too old.
