Contribute
==========


> I have changed my branching model recently (November 2013)! Previously
> the latest version was always in develop, and pull request had to be
> made on this branch. This is no longer the case!


The latest version is always in the **[master](https://gitlab.com/meno/dropzone)**
branch.


> Please provide a test for any new feature (see the [testing section](#testing) below).


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


Coffeescript & Sass (-> Javascript & CSS)
------------------------------------------

Dropzone is written in [Coffeescript](http://coffeescript.org) and
[Sass](http://sass-lang.com/) so *do not* make
changes to the Javascript or CSS files

**I will not merge requests written in Javascript or CSS.**

Please don't include compiled `.js` or `.css` files in your pull requests but only
`.coffee` or `.scss` files.


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


Website
-------

The website is located in `website/` and is generated with [Jekyll](http://jekyllrb.com/).

Most of the content of the website is generated, some parts from the `README.md` and some
directly from the `dropzone.coffee` source file (the configuration options).

This is how you build the site:

```bash
$ grunt build-website
$ cd website
$ jekyll serve # Or jekyll build
```

* Thanks for contributing!*

