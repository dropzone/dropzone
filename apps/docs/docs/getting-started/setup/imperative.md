import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

---
description: How to create a Dropzone upload with JavaScript.
---

# Imperative

As an alternative to the declarative way, you can create Dropzones imperatively \(even on non `<form>`elements\) by instantiating the `Dropzone` class:

<Tabs>
<TabItem value="plain-javascript" label="Plain JavaScript">
```javascript
// The constructor of Dropzone accepts two arguments:
//
// 1. The selector for the HTML element that you want to add
//    Dropzone to, the second
// 2. An (optional) object with the configuration
let myDropzone = new Dropzone("div#myId", { url: "/file/post"});
```
</TabItem>

<TabItem value="jquery" label="jQuery">
```javascript
// The dropzone method is added to jQuery elements and can
// be invoked with an (optional) configuration object.
$("div#myId").dropzone({ url: "/file/post" });
```
</TabItem>
</Tabs>

:::warning

Don’t forget to specify an `url` option if you’re not using a `<form>` element, since Dropzone doesn’t know where to post to without an action attribute. On form elements, Dropzone defaults to the `action` attribute.

:::

For a list of all configuration options, refer to the [configuration section](../../configuration/basics/).

