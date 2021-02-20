<img alt="Dropzone.js" src="https://raw.githubusercontent.com/dropzone/dropzone/assets/github-logo.svg" />

[![Test and Release](https://github.com/dropzone/dropzone/actions/workflows/test-and-release.yml/badge.svg)](https://github.com/dropzone/dropzone/actions/workflows/test-and-release.yml)

Dropzone is a JavaScript library that turns any HTML element into a dropzone.
This means that a user can drag and drop a file onto it, and Dropzone will
display file previews and upload progress, and handle the upload for you via
XHR.

It's fully configurable and can be styled according to your needs.

Quickstart
----------

- [📚 Full documentation](https://dropzone.gitbook.io/dropzone/)
- [💾 Download
  link](https://github.com/dropzone/dropzone/releases/latest/download/dist.zip)
  containing JavaScript UMD modules and CSS files (full and minimised)
- [⚙️ `src/options.js`](https://github.com/dropzone/dropzone/blob/main/src/options.js)
  for all available options

&nbsp;

<img alt="Dropzone Screenshot" width="568" src="https://github.com/dropzone/dropzone/raw/a19faf6c3aef5d3d7f912ca988cc62af1967d5d9/dropzone-preview.png" />

&nbsp;


Community
---------

If you need support please use the [discussions section][discussions] or
[stackoverflow][so] with the `dropzone.js` tag and **not** the GitHub issues
tracker. Only post an issue here if you think you discovered a bug.

If you have a feature request or want to discuss something, please use the
[discussions][] as well.

[discussions]: https://github.com/dropzone/dropzone/discussions
[so]: https://stackoverflow.com/questions/tagged/dropzone.js


> ⚠️ **Please read the [contributing guidelines](CONTRIBUTING.md) before you start
> working on Dropzone!**


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

# MIT License

See LICENSE file
