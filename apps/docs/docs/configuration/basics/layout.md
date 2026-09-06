# Layout

The HTML that is generated for each file by dropzone is defined with the option `previewTemplate` which defaults to this:

```markup
<div class="dz-preview dz-file-preview">
  <div class="dz-details">
    <div class="dz-filename"><span data-dz-name></span></div>
    <div class="dz-size" data-dz-size></div>
    <img data-dz-thumbnail />
  </div>
  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
  <div class="dz-success-mark"><span>✔</span></div>
  <div class="dz-error-mark"><span>✘</span></div>
  <div class="dz-error-message"><span data-dz-errormessage></span></div>
</div>
```

The container \(`dz-preview`\) gets the `dz-processing` class when the file gets processed, `dz-success` when the file got uploaded and `dz-error` in case the file couldn’t be uploaded. In the latter case, `data-dz-errormessage` will contain the text returned by the server.

To overwrite the default template, use the `previewTemplate` config.

You can access the HTML of the file preview in any of the events with `file.previewElement`.

If you decide to rewrite the `previewTemplate` from scratch, you should put elements with the `data-dz-*` attributes inside:

* `data-dz-name`
* `data-dz-size`
* `data-dz-thumbnail` \(This has to be an `<img />` element and the `alt` and `src` attributes will be changed by Dropzone\)
* `data-dz-uploadprogress` \(Dropzone will change the `style.width` property from `0%` to `100%` whenever there’s a `uploadprogress` event\)
* `data-dz-errormessage`

The default options for Dropzone will look for those element and update the content for it.

If you want some specific link to remove a file \(instead of the built in `addRemoveLinks` config\), you can simply insert elements in the template with the `data-dz-remove` attribute. Example:

```markup
<img src="removebutton.png" alt="Click me to remove the file." data-dz-remove />
```

You are not forced to use those conventions though. If you override all the default event listeners you can completely rebuild your layout from scratch.

See the installation section on how to add the stylesheet if you want your Dropzone to look like the example dropzone.

See the [Theming](../theming.md) section, for a more in depth look at how to completely change Dropzone’s UI.

I created an example where I made Dropzone look and feel exactly the way jQuery File Uploader does with a few lines of configuration code. [Check it out!](https://www.dropzonejs.com/bootstrap.html)

