---
layout: default
title: Dropzone.js
---


<section markdown="1">

Usage
=====

The typical way of using dropzone is by creating a form element with the class `dropzone`:

```html
<form action="/file-upload"
      class="dropzone"
      id="my-awesome-dropzone"></form>
```

That's it. Dropzone will find all form elements with the class dropzone,
automatically attach itself to it, and upload files dropped into it to the
specified `action` attribute. The uploaded files can be handled just as if
there would have been a html input like this:

{% highlight html %}
<input type="file" name="file" />
{% endhighlight %}

If you want another name than `file` you can [configure dropzone](#configure)
with the option `paramName`.

> If you're using component don't forget to `require("dropzone");` otherwise it won't be activated.


If you want your file uploads to work even without JavaScript, you can include
an element with the class `fallback` that dropzone will remove if the browser
is supported. If the browser isn't supported, Dropzone will not create fallback
elements if there is a fallback element already provided. (Obviously, if the
browser doesn't support JavaScript, the form will stay as is)

Typically this will look like this:

```html
<form action="/file-upload" class="dropzone">
  <div class="fallback">
    <input name="file" type="file" multiple />
  </div>
</form>
```



Create dropzones programmatically
---------------------------------

Alternatively you can create dropzones programmaticaly (even on non `form`
elements) by instantiating the `Dropzone` class

```js
// Dropzone class:
var myDropzone = new Dropzone("div#myId", { url: "/file/post"})
```

or if you use jQuery, you can use the jQuery plugin Dropzone ships with:

```js
// jQuery
$("div#myId").dropzone({ url: "/file/post" });
```

> Don't forget to specify an `url` option if you're not using a form element,
> since Dropzone doesn't know where to post to without an `action` attribute. 



Server side implementation
--------------------------

Dropzone does *not* provide the server side implementation of handling the files,
but the way files are uploaded is identical to simple file upload forms like this:

```html
<form action="" method="post" enctype="multipart/form-data">
  <input type="file" name="file" />
</form>
```

To handle basic file uploads on the server, please look at the corresponding
documentation. Here are a few documentations, if you think I should add some,
please contact me.

- [NodeJS with express](http://howtonode.org/af136c8ce966618cc0857dbc5e5da01e9d4d87d5/really-simple-file-uploads)
- [Ruby on rails](http://guides.rubyonrails.org/form_helpers.html#uploading-files)
- [PHP file upload](http://www.php.net/manual/en/features.file-upload.post-method.php#example-354)
- [Tutorial for Dropzone and Lavarel (PHP)](http://maxoffsky.com/code-blog/howto-ajax-multiple-file-upload-in-laravel/) written by Maksim Surguy


</section>

