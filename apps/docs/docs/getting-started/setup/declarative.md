---
description: How to create a Dropzone upload with HTML attributes.
---

# Declarative

The easiest way to use dropzone is by creating a form element with the class `dropzone`:

```markup
<form action="/file-upload"
      class="dropzone"
      id="my-awesome-dropzone"></form>
```

That’s it. Dropzone will find all form elements with the class dropzone, automatically attach itself to it, and upload files dropped into it to the specified `action` attribute. The uploaded files can be handled just as if there would have been a html input like this:

```markup
<input type="file" name="file" />
```

:::info

If you want another name than `file` you can [configure Dropzone](../../configuration/basics/) with the option `paramName`.

:::

## Configuration

When declaring a Dropzone like this, you might be wondering how to configure it then, and fortunately it's quite easy:

1. Give the element that you want to configure an html `id`
2. Setup the configuration on `Dropzone.options`

#### Example:

```markup
<script>
  // Note that the name "myDropzone" is the camelized
  // id of the form.
  Dropzone.options.myDropzone = {
    // Configuration options go here
  };
</script>
<form action="/target" class="dropzone" id="my-dropzone"></form>
```

You can create as many options on Dropzone.options as you need — for each HTML element that you created, you can simply add the configuration.

For information on available configuration options, see the [configuration section](../../configuration/basics/).

### The "auto discover" feature

:::danger

The auto discover feature has been removed in Dropzone version 6.0.0! If you depend on this you can simply add this code to the end of your document:

```html
<script>
  Dropzone.discover();
</script>
```

:::

The way this works is called "auto discover". Dropzone checks when the DOM content finished loading, and then parses all HTML elements and looks for one with the class `dropzone`. If it finds an element, it checks if the element has an `id`. If it does, then it converst the id name to camel case (`my-dropzone` -> `myDropzone`) and checks if there is an entry in `Dropzone.options` with that key. If there is, then it uses that configuration object to instantiate the Dropzone for this object.

This behaviour can be disabled in two ways:

1. Either set `Dropzone.autoDiscover = false;` somewhere in your JS. Just make sure it's invoked before the DOM ready event is dispatched.
2. Set `Dropzone.options.myDropzone = false;` for individual dropzones. This allows you to use the auto discover feature, and only disable it for specific elements.

:::warning

Dropzone parses the document when the document has finished loading, looks for elements that have the `dropzone` class, checks if there is a configuration in `Dropzone.options` for it, and then creates a Dropzone instance for that element. If all of that happened, before you defined your configuration, then **Dropzone will miss the configuration**. So make sure, that your **configuration** code is **reached before** Dropzone **auto discovers** these elements.

:::

If you're not too keen on this approach, don't worry. Go to the next section to see how to create them imperatively.
