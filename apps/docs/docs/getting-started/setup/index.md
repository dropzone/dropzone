---
description: How to setup a Dropzone on your website.
---

# ✅ Setup

After you've [installed Dropzone](../installation/) there are two ways to setup Dropzone. The easiest way is to let Dropzone auto discover your forms, and attach the drag and drop events automatically. For that, you simply need to provide a class to your form. This is called the **declarative** setup.

[declarative.md](declarative.md)



If you have a more complex use case, or you'd like to control _when_ the Dropzone object is created and listens to events, you can instantiate the Dropzone yourself. This is called the **imperative** setup.

[imperative.md](imperative.md)



### Which approach is better?

There is not one approach that is better than the other. I would say that if you use a package manager, it's likely you'll prefer the **imperative** approach, but the **declarative** approach is generally a bit simpler.

Choose the **declarative** approach when...

* ...you're not used to writing JavaScript code
* ...your configuration is very simple or you're happy with the defaults

Choose the **imperative** approach when...

* ...you're writing a web app, and your routes need to create the Dropzone after loading the page
* ...you only want to create a Dropzone after specific events (for example if the user expanded a section)
* ...the configuration of your Dropzone depends on some additional context (for example if you want to send the files to a different URL on some other condition)
* ...you simply prefer the imperative way.

