Contribute
==========

The latest stable version is always in the **[master](https://github.com/enyo/dropzone)** branch (which always
points at the latest version tag).

The latest development version is in the **[develop](https://github.com/enyo/dropzone/tree/develop)** branch.

> Use the develop branch if you want to contribute or test features.

Please do also **send pull requests to the `develop` branch**.
I will **not** merge pull requests to the `master` branch.


> Please provide a test for any new feature (see the [testing section](#testing) below).


Communicate
-----------

Before you start implementing new features, please create an issue about it first and discuss your intent.
It might be something that someone else is already implementing or that goes against the concepts of Dropzone, and I really hate rejecting pull requests others spent hours writing on.


Developer Dependencies
----------------------

The first thing you need to do, is to install the developer dependencies:

```bash
$ npm install
```

This will install all the tools you need to compile the source files and to test
the library.


Coffeescript & Stylus (-> Javascript & CSS)
------------------------------------------

Dropzone is written in [Coffeescript](http://coffeescript.org) and
[Stylus](http://learnboost.github.com/stylus/) so *do not* make
changes to the Javascript or CSS files

**I will not merge requests written in Javascript or CSS.**

Please don't include compiled `.js` or `.css` files in your pull requests but only
`.coffee` or `.styl` files. That way pull requests aren't polluted and I can see
immediately what you changed.


To build the library use [grunt](http://gruntjs.com).

```bash
$ grunt -h # Displays available options
$ grunt # compiles all coffeescript and stylus files
$ grunt watch # watches for changes and builds on the fly
```

> I recommend using `grunt watch` when you begin developing. This way you can't
> forget to compile the source files and will avoid headaches.


Testing
-------

To test the library, open `test/test.html` in your browser or type `npm test`
which will run the tests in your console in a headless browser.

The tests are also written in coffeescript in the `test/test.coffee` file,
and compiled with `grunt js` or `grunt watch`.


* Thanks for contributing!*

