# Dropzone.js Version 0.1.6-dev

Dropzone.js is a light weight JavaScript library for [ender](http://ender.no.de) that turns an HTML element into a dropzone.
This means that a user can drag and drop a file onto it, and the file gets uploaded to the server via AJAX.



## Main features

- Image thumbnail previews. Simply register the callback `thumbnail(file, data)` and display the image wherever you like
- Multiple files and synchronous uploads
- Progress updates
- Support for large files

## Browser support

- Chrome 7+
- Firefox 4+
- IE 10+
- Opera 12+
- Safari 5+

## Why another library?

I realize that there [are](http://valums.com/ajax-upload/) [already](http://tutorialzine.com/2011/09/html5-file-upload-jquery-php/) [other](http://code.google.com/p/html5uploader/) [libraries](http://blueimp.github.com/jQuery-File-Upload/) out there but the reason I decided to write my own are the following:

- I didn't want it to be too big, and to cumbersome to dive into.
- I want to design my own elements. I only want to register callbacks so I can update my elements accordingly.
- Big files should get uploaded without a problem.
- I wanted a callback for image previews, that don't kill the browser if too many to big images are viewed.
- I want to use the latest API of browsers. I don't care if it falls back to the normal upload form if the browser is too old.
