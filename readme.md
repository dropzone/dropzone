<h1 align="center">
  <img alt="Dropzone.js" src="http://www.dropzonejs.com/images/logo.png" />
</h1>

*Version 3.10.2*

![Build status](https://travis-ci.org/enyo/dropzone.png?branch=master)  

Dropzone.js is a light weight JavaScript library that turns an HTML element into a dropzone.
This means that a user can drag and drop a file onto it, and the file gets uploaded to the server via AJAX.

* * *

> If you want support, please use [stackoverflow](http://stackoverflow.com/) with the `dropzone.js` tag and not the
> GitHub issues tracker. Only post an issue here if you think you discovered a bug or have a feature request.

* * *

**Please read the [contributing guidelines](CONTRIBUTING.md) before you start working on Dropzone!**

<div align="center">
  <a href="https://github.com/enyo/dropzone/releases/latest"><img src="https://raw.github.com/enyo/dropzone/master/download.png" alt="Download" /></a>
</div>


Starting with version 2.0.0 this library does no longer depend on jQuery (but
it still works as a jQuery module).

It is written as a [component](https://github.com/component/component) but
there's a standalone version, and an [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)
module that's compatible with [RequireJS](http://requirejs.org) in the downloads
folder.

![Screenshot](http://i.imgur.com/zXyTjMp.png)



## Main features

- Image thumbnail previews. Simply register the callback `thumbnail(file, data)` and display the image wherever you like
- Retina enabled
- Multiple files and synchronous uploads
- Progress updates
- Support for large files
- Complete theming. The look and feel of Dropzone is just the default theme. You
  can define everything yourself by overwriting the default event listeners.
- Well tested

## Documentation

For the full documentation and installation please visit www.dropzonejs.com

Please also refer to the [FAQ](https://github.com/enyo/dropzone/wiki/FAQ).

## Examples

For examples, please see the [GitHub wiki](https://github.com/enyo/dropzone/wiki).

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
new Dropzone("div#my-dropzone", { /* options */ });
```

> Note that dropzones don't have to be forms. But if you choose another element you have to pass the `url` parameter in the options.

For configuration options please look at the [documentation on the website](http://www.dropzonejs.com/#configuration)
or at the [source](https://github.com/enyo/dropzone/blob/master/src/dropzone.coffee#L90).



### Register for events

I use [emitter](https://github.com/component/emitter) to manage events. If you want to register to some event you can do so on the `dropzone` object itself:

```js
Dropzone.options.myDropzone({
  init: function() {
    this.on("error", function(file, message) { alert(message); });
  }
});
// or if you need to access a Dropzone somewhere else:
var myDropzone = Dropzone.forElement("div#my-dropzone");
myDropzone.on("error", function(file, message) { alert(message); });
```

For a list of all events, please look at the chapter 
[»listen to events«](http://www.dropzonejs.com/#listen_to_events) in the documentation
or at the [source](src/dropzone.coffee#L43).


## Browser support

- Chrome 7+
- Firefox 4+
- IE 10+
- Opera 12+ (Version 12 for MacOS is disabled because their API is buggy)
- Safari 6+

For all the other browsers, dropzone provides an oldschool file input fallback.

## Why another library?

I realize that there [are](http://valums.com/ajax-upload/) [already](http://tutorialzine.com/2011/09/html5-file-upload-jquery-php/) [other](http://code.google.com/p/html5uploader/) [libraries](http://blueimp.github.com/jQuery-File-Upload/) out there but the reason I decided to write my own are the following:

- I didn't want it to be too big, and to cumbersome to dive into.
- I want to design my own elements. I only want to register callbacks so I can update my elements accordingly.
- Big files should get uploaded without a problem.
- I wanted a callback for image previews, that don't kill the browser if too many too big images are viewed.
- I want to use the latest API of browsers. I don't care if it falls back to the normal upload form if the browser is too old.
- I don't think that it's necessary anymore to depend on libraries such as jQuery (especially when providing functionality that isn't available in old browsers anyway).

## Other projects

You might also be interested in my [open source tooltip library Opentip](http://www.opentip.org/).
![Opentip](http://i.imgur.com/Zubpo.png)

License
-------
(The MIT License)

Copyright (c) 2012 Matias Meno &lt;m@tias.me&gt;<br>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
