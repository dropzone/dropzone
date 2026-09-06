import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

---
description: This is how I use the library myself
---

# npm or yarn

As with most visual JavaScript libraries there are two sides to the story: getting the JavaScript code in your project, and getting the CSS code. Let's start with JS.

Add dropzone as a dependency to your project:

<Tabs>
<TabItem value="npm" label="npm">
```bash
$ npm install --save dropzone
```
</TabItem>

<TabItem value="yarn" label="yarn">
```bash
$ yarn add dropzone
```
</TabItem>
</Tabs>

In your html, make sure you have an element that will act as the dropzone:

```markup
<!-- Example of a form that Dropzone can take over -->
<form action="/target" class="dropzone"></form>
```

## JavaScript

Without going too much into detail, historically, there have been plenty of ways to import libraries in JavaScript. Fortunately, not too long ago a standard was introduced that was implemented in browsers as well. This standard is called [ECMAScript modules](https://nodejs.org/api/esm.html), also commonly referred to as [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). This has caused JavaScript modules to become a defacto standard, which is why I recommend to use this approach.

Before JavaScript modules there were quite a few other standards. The only other module standard that Dropzone now supports is the [CommonJS format](https://en.wikipedia.org/wiki/CommonJS) which is what node is using too (note that [node also has support for JavaScript modules](https://nodejs.medium.com/announcing-core-node-js-support-for-ecmascript-modules-c5d6dc29b663) now).

We also provide a standalone file that you can simply include in your browser. See the corresponding section for this: [stand-alone.md](stand-alone.md "mention").

```javascript
// If you are using JavaScript/ECMAScript modules:
import Dropzone from "dropzone";

// If you are using CommonJS modules:
const { Dropzone } = require("dropzone");

// If you are using an older version than Dropzone 6.0.0,
// then you need to disabled the autoDiscover behaviour here:
Dropzone.autoDiscover = false;

let myDropzone = new Dropzone("#my-form");
myDropzone.on("addedfile", file => {
  console.log(`File added: ${file.name}`);
});
```

:::warning

In order for Dropzone to find the `#my-form` the element must already exist. Either put your `<script>` import at the end of your HTML file, or use some sort of `window.onload` logic.

:::

## CSS

Dropzone ships with two files: a `basic.css` and a `dropzone.css`. The `dropzone.css` contains all the styling you can see in the examples and is a ready-to-go solution. If you want to have total control over the styling, you can use the `basic.css` as a base, and build on top of that, or not use any of the provided CSS files at all.

Importing this CSS file greatly depends on the bundler or framework that you are using so I won't go into much detail here.

You can also simply include the CSS file in your html. Refer to the [stand-alone.md](stand-alone.md "mention")section for this.

:::info

You can check out the [examples repository](https://github.com/dropzone/dropzone-examples) for ways to handle this with different bundlers.

:::
