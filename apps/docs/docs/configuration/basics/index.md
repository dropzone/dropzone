import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ⚙ Basics

In this section we'll co over the fundamentals of configuring Dropzones.

:::info

You should already be familiar on how to pass a configuration object to Dropzone in the [declarative](../../getting-started/setup/declarative.md) and the [imperative](../../getting-started/setup/imperative.md) way. If not, please visit the respective sections.

:::

This is what a typical configuration of Dropzone would look like:

<Tabs>
<TabItem value="declarative" label="Declarative">
```markup
<form action="/target" class="dropzone" id="my-great-dropzone"></form>

<script>
  Dropzone.options.myGreatDropzone = { // camelized version of the `id`
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 2, // MB
    accept: function(file, done) {
      if (file.name == "justinbieber.jpg") {
        done("Naha, you don't.");
      }
      else { done(); }
    }
  };
</script>
```
</TabItem>

<TabItem value="imperative" label="Imperative">
```javascript
import Dropzone from "dropzone";

let myDropzone = Dropzone({
  paramName: "file", // The name that will be used to transfer the file
  maxFilesize: 2, // MB
  accept: function(file, done) {
    if (file.name == "justinbieber.jpg") {
      done("Naha, you don't.");
    }
    else { done(); }
  }
});
```
</TabItem>
</Tabs>

:::tip

For a list of all possible options, refer to the [`src/options.js`](https://github.com/dropzone/dropzone/blob/main/src/options.js) file.

:::

### Events

If you want to react to events happening (a file has been added or removed, an upload started, a progress changed, etc...) you want to be listening to events. Checkout the events section for more information on events.

[events.md](../events.md)

### Overriding default event handlers

:::danger

In general **you should never have to do this**, and you should be familiar with the code if you decide to do it.

:::

You can also override default event handlers. This should be approached with absolute caution since it can break if you upgrade the library and can also remove default functionality that you might not want to  lose:

```javascript
let myDropzone = Dropzone("#my-element", {
  addedfile: file => {
    // ONLY DO THIS IF YOU KNOW WHAT YOU'RE DOING!
  }
});
```

The difference here, is that the default event handler `addedfile` has been changed, instead of adding a new event handler with `myDropzone.on("addedfile", () => {})`
