Contribute
==========

The latest stable version is always in the **[master](https://github.com/enyo/dropzone)** branch (which always
points at the latest version tag).

The latest development version is in the **[develop](https://github.com/enyo/dropzone/tree/develop)** branch.

> Use the develop branch if you want to contribute or test features.

Please do also **send pull requests to the `develop` branch**.
I will **not** merge pull requests to the `master` branch.


### Coffeescript & Stylus (-> Javascript & CSS)

Dropzone is written in [Coffeescript](http://coffeescript.org) and
[Stylus](http://learnboost.github.com/stylus/) so *do not* make
changes to the Javascript or CSS files

**I will not merge requests written in Javascript or CSS.**

Please don't include compiled `.js` or `.css` files in your pull requests but only
`.coffee` or `.styl` files. That way pull requests aren't polluted and I can see
immediately what you changed.

### Building

If you want to build the library to test it, use `make`.

```bash
$ make build # compiles the coffeescript files to lib/
$ make watch # watches for changes and builds on the fly
$ make download # takes the compiled lib/dropzone.js file and builds the downloads/*.js files
$ make css # compiles the stylus files
$ make watchcss # watches for changes
```


* Thanks for contributing!*

