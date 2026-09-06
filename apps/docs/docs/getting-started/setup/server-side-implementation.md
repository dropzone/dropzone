---
description: How to handle uploaded files on the server.
---

# Server Side Implementation

Dropzone does **not** provide the server side implementation of handling the files.

The way files are uploaded is identical to a standard file upload with a standard HTML form like this:

```markup
<form action="" method="post" enctype="multipart/form-data">
  <input type="file" name="file" />
</form>
```

So if your server accepts files, uploaded like this, it will accept files uploaded with Dropzone.

So please look at the corresponding documentation of the server implementation you're using. Here are a few documentations, if you think I should add some, please contact me.

* [Spring](https://spring.io/guides/gs/uploading-files/)
* [NodeJS with express](http://howtonode.org/really-simple-file-uploads)
* [Ruby on rails](http://guides.rubyonrails.org/form_helpers.html#uploading-files)
* [Complete PHP tutorial](http://www.startutorial.com/articles/view/how-to-build-a-file-upload-form-using-dropzonejs-and-php) by startutorial.com
* [Basic PHP file upload](http://www.php.net/manual/en/features.file-upload.post-method.php#example-354)
* [Tutorial for Dropzone and Lavarel (PHP)](http://maxoffsky.com/code-blog/howto-ajax-multiple-file-upload-in-laravel/) written by Maksim Surguy
* [Symfony2 and Amazon S3](http://www.jesuisundev.fr/upload-drag-drop-via-dropzonejs-symfony2-on-cloud-amazon-s3/)
* [File upload in ASP.NET MVC using Dropzone JS and HTML5](http://venkatbaggu.com/file-upload-in-asp-net-mvc-using-dropzone-js-and-html5/)
* [Servicestack and Dropzone](http://www.buildclassifieds.com/2016/01/08/uploading-images-servicestack-and-dropzone/)
* [How to build a file upload form using DropzoneJS and Go](https://hackernoon.com/how-to-build-a-file-upload-form-using-dropzonejs-and-go-8fb9f258a991)
* [How to display existing files on server using DropzoneJS and Go](https://hackernoon.com/how-to-display-existing-files-on-server-using-dropzonejs-and-go-53e24b57ba19)

Paid documentations:

* [eBook for Dropzone with PHP](http://www.startutorial.com/homes/dropzonejs_php_the_complete_guide?utm_source=dzj\&utm_medium=banner\&utm_campaign=dropzonejs) by startutorial.com.

Please look at the [Dropzone FAQ](https://gitlab.com/meno/dropzone/-/wikis/FAQ) if you need more information.
