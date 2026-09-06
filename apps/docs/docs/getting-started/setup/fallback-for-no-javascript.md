---
description: In case you want to handle browsers that don't have JavaScript enabled.
---

# Fallback for no JavaScript

Sometimes you need to build websites that should work even if the user doesn't have JavaScript enabled or the browser is not supported. Of course, a drag'n'drop JavaScript library won't work in these cases, but Dropzone got you covered by offering a way to define a fallback.

Inside your dropzone HTML element \(in most cases that's a `<form>` element\), you can define an additional element with the class `fallback` . When \(or in this case: "if"\) Dropzone initializes, it will simply remove this element.

Here is an example of what this might look like:

```markup
<form action="/file-upload" class="dropzone">
  <div class="fallback">
    <input name="file" type="file" multiple />
  </div>
</form>
```

So in case the browser doesn't support JavaSript, the user will simply see the `fallback` div with the file input element, and everything will work normally but with no drag and drop support.

_If_ the browser is supported however, this element will be removed, and Dropzone will add a notice that it accepts dropped files and handle them.

