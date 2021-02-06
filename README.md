<img alt="Dropzone.js" src="http://www.dropzonejs.com/images/new-logo.svg" />

Dropzone.js is a JavaScript library that turns any HTML element into a dropzone.
This means that a user can drag and drop a file onto it, and the file gets
uploaded to the server via XHR.

The file either gets uploaded directly to the configured URL, or you can handle
and manage the file upload yourself.


If you want support, please use the [discussions
section](https://github.com/dropzone/dropzone/discussions) or
[stackoverflow](https://stackoverflow.com/questions/tagged/dropzone.js) with the
`dropzone.js` tag and **not** the GitHub issues tracker. Only post an issue here
if you think you discovered a bug or have a feature request.


* * *

> **Please read the [contributing guidelines](CONTRIBUTING.md) before you start
> working on Dropzone!**


<img alt="Dropzone Screenshot" width="585" src="http://i.imgur.com/Xf7QvVG.png" />


Quickstart
----------

The recommended way to install Dropzone is with [yarn](https://yarnpkg.com) and
[webpack](http://webpack.js.org). I'll provide an example project soon!

[Download the standalone files](https://github.com/dropzone/dropzone/releases/latest/download/dist.zip) and import them on your website.
(The JavaScript files in there are UMD modules, compatible with requirejs).

For more information, please consult the [Documentation](https://dropzone.gitbook.io/dropzone/).

Dropzone does **not** depend on jQuery but has jQuery integration.

Main features
-------------

- Beautiful by default
- Image thumbnail previews. Simply register the callback `thumbnail(file, data)`
  and display the image wherever you like
- Retina enabled
- Multiple files and synchronous uploads
- Progress updates
- Support for large files
- Complete theming. The look and feel of Dropzone is just the default theme. You
  can define everything yourself by overwriting the default event listeners.
- Browser image resizing (resize the images before you upload them to your
  server)
- Well tested

Documentation
-------------

For all the configuration options and installation guide please visit [the
documentation site](https://dropzone.gitbook.io/dropzone/).

If you simply want to look up the configuration options, look at
[src/options.js](https://github.com/dropzone/dropzone/blob/main/src/options.js).

## Examples

For examples, please see the [GitLab wiki](https://github.com/dropzone/dropzone/wiki).


Server side implementation
--------------------------

Dropzone does *not* provide the server side implementation of handling the
files, but the way files are uploaded is identical to simple file upload forms
like this:

```html
<form action="" method="post" enctype="multipart/form-data">
  <input type="file" name="file" />
</form>
```

To handle basic file uploads on the server, please look at the corresponding
documentation. Here are a few documentations, if you think I should add some,
please contact me.

# Compatibility

Dropzone supports all current browsers and IE up to IE11.

For all the other browsers, dropzone provides an oldschool file input fallback.

# MIT License

See LICENSE file
