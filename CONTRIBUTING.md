Contribute
==========

> **I'm in the process of making some substantial changes to this library,
> so please DO NOT create any PRs. I will simply close them.**


When I'm done, these rules will apply:


Communicate
-----------

Before you start implementing new features, please create an issue about it
first and discuss your intent.

It might be something that someone else is already implementing or that goes
against the concepts of Dropzone, and I really hate rejecting pull requests
others spent hours writing on.


Developer Dependencies
----------------------

The first thing you need to do, is to install the developer dependencies:

```bash
$ yarn install
```

This will install all the tools you need to compile the source files and to test
the library.


ECMAScript 6 & Sass (-> Javascript & CSS)
------------------------------------------

Since June 2017, Dropzone is written in [ECMAScript
6](https://babeljs.io/learn-es2015/) and [Sass](http://sass-lang.com/).


Testing
-------

To test the library simply run `yarn test`.
