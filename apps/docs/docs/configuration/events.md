# 📞 Events

Dropzone triggers events when processing files, to which you can register easily, by calling `.on(eventName, callbackFunction)` on your Dropzone **instance:**

```javascript
let myDropzone = Dropzone("#my-element", { /* options */ });
myDropzone.on("addedfile", file => {
  console.log("A file has been added");
});
```

If you're configuring your Dropzone declaratively, then you don't have access to the instance to add events. In these case, you can use the `init` config, which is a function that is invoked when the Dropzone is initialized:

```javascript
Dropzone.options.myElement = {
  // Note: using "function()" here to bind `this` to
  // the Dropzone instance.
  init: function() {
    this.on("addedfile", file => {
      console.log("A file has been added");
    });
  }
};
```

:::warning

**Careful**: when providing the init function, make sure you use the `function()` syntax instead of the arrow syntax, because otherwise the keyword `this` will not reference the Dropzone instance. For more information read up on the [difference between the arrow function expression and the function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

:::

Both ways are perfectly fine, but you need to use the `init()` function if you setup your Dropzone declaratively.

:::tip

Dropzone itself relies heavily on events. Everything that’s visual is created by listening to them. They are a fundamental part of making Dropzone look and feel how you want it to.

:::

### List of all events

We will be listing all possible events here soon, but until we do that, you can find all of them, well documented in the [source code](https://github.com/dropzone/dropzone/blob/main/src/options.js#L574). These are the implementations for the default event handles so you can see which arguments they receive. You can ignore the content of them if you aren't interested, or override the default behaviour (explained in the next section).

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

You should only do this when you really know how Dropzone works, and when you want to [completely theme your Dropzone](theming.md).
