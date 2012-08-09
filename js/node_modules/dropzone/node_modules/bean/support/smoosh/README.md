SMOOOOSH.
=========
How would you smoosh a lion and a tiger? A tialiganer, right?

![smoosh](http://f.cl.ly/items/3o0y3m3o2Z3l1e0i1V2V/Screen%20shot%202011-03-05%20at%2012.13.54%20AM.png)

SMOOSH is a tool for packaging your javascript projects... it will run [JSHint](http://jshint.com) against your files, then build and minify your files if you'd like with [UglifyJS](https://github.com/mishoo/UglifyJS)

to install smoosh do something like this...

    npm install smoosh

CONFIG
======
Currently, smoosh requires a config.json file to work. Your config file should look something like this (check the examples folder for a working example):

    {
      "VERSION": "0.1", // optional
      "DIST_DIR": "dist", // optional
      "JSHINT_OPTS": { ... }
      "JAVASCRIPT": {
        "base": [ ... ],
        "secondary": [ ... ]
      }
    }

Your config options include:

  + VERSION: an optional version number which will be appended to your built files
  + JAVASCRIPT:
  + key: the name of your compiled file (ie: 'mootools-core', 'base-bundle', etc.)
  + value: an array of file paths to be bundled (ie. ['./src/drag.js', './src/drop.js'])
  + DIST_DIR: the directory to output your files to (if no directory is specified, 'dist' will be used)
  + JSHINT_OPTS: the options to use if running jshint

USING SMOOSH WITH TERMINAL
==========================

once installed with npm, smoosh can be accessed easily from the command line! Just create your config file (shown above), then run commands. Here's a list of some of them:


    //any of these commands will execute all smoosh tasks with config.json
    smoosh ./config.json
    smoosh make ./config.json
    smoosh -m ./config.json

    //executing either of these commands will destroy the dist folder
    smoosh clean ./config.json
    smoosh -d ./config.json

    //these will generate ugliyjs minified versions of your packaged source
    smoosh compressed ./config.json
    smoosh -c ./config.json

    //these will generate full, uncompressed version of your packaged source
    smoosh uncompressed
    smoosh -f ./config.json

    //executing either of these commands will build both compressed and uncompressed versions of your source
    smoosh build ./config.json
    smoosh -b ./config.json

    //these will run jshint against your uncompressed source
    smoosh run ./config.json
    smoosh -r ./config.json

    //the -a flag will run analyze.. you must include a build type for analyze to work
    smoosh -ca ./config
    smoosh -ba ./config
    smoosh -fa ./config

    //as you might have guessed, you can specify multiple flags at the same time
    smoosh -dba ./config //<-- this will clean the dist folder, build new files, and then analyze them


USING SMOOSH WITH THE CODEZ
===========================

once installed, smoosh is pretty easy to use...

    var smoosh = require('smoosh');

Once required there are several methods available to you:

CONFIG
------
As stated above, smoosh requires that you pass it the path to your configuration json file. To do that, you would do:

    smoosh.config('./config.json')

CLEAN
-----
The clean method will remove your distribution directory. **Warning** This will empty your entire DIST directory. So this may be unwanted behavior if your DIST directory is "./". It is preferred that this is only used when you have a dedicated dist folder. Eg: "./src/build" or "./dist"

    smoosh.clean();

RUN
---
Run takes one argument; a string which specifies what to run. Currently run only works with jslint, therefore you can do either:

    smoosh.run('jslint');

    //or

    smoosh.run();

In the future we may add more useful things here.

BUILD
-----
Build is used to build your sources together. You can build uncompressed or compressed files or both! You can use it like this:

    smoosh.build('uncompressed');

    //or

    smoosh.build('compressed');

    //or

    smoosh.build() // <-- this will build both compressed and uncompressed


ANALYZE
-------
Analyzed is useful when you're curious if you're making your files larger or smaller. It will return relevant file size for uncompressed, compressed, or gzipped files.

    smoosh.analyze('uncompressed');

    //or

    smoosh.analyze('compressed');

    //or

    smoosh.analyze('gzipped'); //it gzips the compressed files only

    //or

    smoosh.analyze(); //which will do analyze all types

MAKE
----
Make can currently be used as a shortcut to run all smoosh methods... It requires one argument, the path to the config file.json.

    smoosh.make('./config.json');

    //is the same as
    smoosh.config('./config.json').run().build().analyze();

CHAINING
--------
Note: that smoosh supports chaining, if you're into that sorta thing.
