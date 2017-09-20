Contribute
==========

The latest version is always in the **[master](https://gitlab.com/meno/dropzone)**
branch.

> Please provide a test for any new feature (see the [testing section](#testing) below).

CoffeScript -> EcmaScript6
---------------------

Starting with Dropzone 5.2, the library is written in ES6 instead of CoffeeScript. This
makes it easier for contributors, and is more future proof.

In order for older browsers to still be supported, the `dist/` files are still compiled with
[babel](https://babeljs.io/), but in a few years, that compilation step can be removed.

The only caveat to this approach, is not to use any actual ES6 features like `Array.from`
or `Array.isArray` since that would require a polyfill. This means, that only syntactic sugar
should be used.


Communicate
-----------

Before you start implementing new features, please create an issue about
it first and discuss your intent.

It might be something that someone else is already implementing or that
goes against the concepts of Dropzone, and I really hate rejecting pull
requests others spent hours writing on.


Developer Dependencies
----------------------

The first thing you need to do, is to install the developer dependencies:

```bash
$ npm install
```

This will install all the tools you need to compile the source files and to test
the library.


ECMAScript 6 & Sass (-> Javascript & CSS)
------------------------------------------

Since June 2017, Dropzone is written in [ECMAScript 6](https://babeljs.io/learn-es2015/) and
[Sass](http://sass-lang.com/).

Please don't include compiled `.js` or `.css` files in your pull requests but only the source files.

Testing
-------

To test the library, open `test/test.html` in your browser or type `npm test`
which will run the tests in your console in a headless browser.


Website
-------

The website is located in `website/` and is generated with [Jekyll](http://jekyllrb.com/).

Most of the content of the website is generated, some parts from the `README.md` and some
directly from the `dropzone.js` source file (the configuration options).

This is how you build the site:

```bash
$ grunt build-website
$ cd website
$ jekyll serve # Or jekyll build
```

**Thanks for contributing!**

