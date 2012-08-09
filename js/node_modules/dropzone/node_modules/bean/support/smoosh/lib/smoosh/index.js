var fs = require('fs'),
    colors = require('colors'),
    uglifyJs = require('uglify-js'),
    jshint = require('jshint').JSHINT,
    asciimo = require('asciimo').Figlet,
    gzip = require('gzip'),
    rimraf = require("rimraf");

/**
  * SOME DUMB HELPERS
  */

// use like: [].filter(clean);
function clean (item) {
  return item != null;
}

function bind (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  }
}

function keys (obj) {
  var accumulator = [];
  for (var propertyName in obj) {
    accumulator.push(propertyName);
  }
  return accumulator;
}


/**
  * _FILES OBJ IS FILES YOU. Yup.
  */

var _files = {
  JAVASCRIPT: {},
  JAVASCRIPT_RAW: {},
  JAVASCRIPT_OLD: {},
  JAVASCRIPT_MIN: {},
  JAVASCRIPT_MIN_OLD: {},
  CSS: {},
  CSS_OLD: {},
  CSS_MIN: {},
  CSS_MIN_OLD: {}
};



/**
  * _WRITE OBJ IS _WRITE YOU.
  */

var _write = {

  flushed: false,
  messageQueue: [],
  welcomed: false,

  _messages: [],
  _response: [],
  _flushed: false,

  message: function(message) {
    if (this._flushed) {
      console.log(message);
    } else {
      this._messages.push(message);
    }
  },

  flush: function () {
    if (this._flushed) return;
    this._flushed = true;
    while (this._messages[0]) this.message(this._messages.shift());
  },

  welcome: function (callback) {
    if (this.welcomed) return callback && callback();
    this.welcomed = true;
    this.newLine();
    this.message('smoosh');

    var font = 'Banner3',
        text = 'smoosh',
        that = this;

    asciimo.write(text, font, function(art){
      that._messages[1] = art.rainbow;
      that.flush();
    });
  },

  newLine: function () {
    this.message('*********************************************************************\n'.rainbow);
  },

  noConfig: function () {
    this.newLine();
    this.message('Whoa! You fucked up... smoosh needs a valid config file!\n'.yellow);
  },

  jshint: function(key, errors) {
    if (!errors.length) {
      this.message('+ Congratulations. You are the perfect JavaScripter.'.green);
      this.message('  '.green + key.yellow + ' PASSED jshint with no errors!\n');
    } else {
      this.message([
        '- Boo!',
        '*' + key + '*',
        'FAILED JSHint with',
         errors.length,
        'error' + (errors.length > 1 ? 's' : '') + ':'
      ].join(' ').magenta);
      var that = this;
      errors.forEach(function (err) {
        that.message('  ' + err.id + " line " + err.line + ": " + err.reason.yellow);
      });
      this.message(' '); // <- force new line for pretty printing ;)
    }
  },

  analysis: function (type, file, oldLen, newLen){
    var fileDiff = Math.abs(oldLen - newLen).toString();
    this.message('+ The new size of ' + type.magenta + ' ' + file.magenta + ' is ' + newLen.toString().magenta + ' bytes!');

    if (newLen < oldLen) {
      this.message('  Great job! That\'s '.green + fileDiff + ' bytes less!\n'.green);
    } else if (newLen > oldLen) {
      this.message('  Dude! You made it worse! That\'s '.red + fileDiff + ' bytes more!\n'.red);
    } else {
      this.message('  Not bad. But how does it feel to do all that work and make no difference.\n'.yellow);
    }
  },

  built: function (type, file) {
    this.message('+ ' + file.yellow + ' was successfully built as ' + type);
  },

  noOldFiles: function (type, key){
    this.message('No old file ' + key + ' of type ' + type + ' to compare against.');
  }

};



/**
  * _CONFIG OBJ IS _CONFIG YOU.
  */

var _config = {

  config: null,
  DIST_DIR: {},
  STATIC_DIR: {},

  init: function (configurations) {
    try {
      this.config = typeof configurations == 'string' ?
        JSON.parse(fs.readFileSync(configurations, 'UTF-8')) : // JSON FILE
        configurations; // { literal }
    } catch (e) {
      _write.noConfig();
      return _API;
    }
    _write.welcome();

    this.setDir('STATIC_DIR', 'JAVASCRIPT');
    this.setDir('STATIC_DIR', 'CSS');

    this.setDir('DIST_DIR', 'JAVASCRIPT', 'dist');
    this.setDir('DIST_DIR', 'CSS', 'dist/css');

    this.process('JAVASCRIPT');
    this.process('CSS');

    return module.exports;
  },

  setDir: function (what, who, opt_default) {
    if (this.config[who] && this.config[who][what]) {
      this[what][who] = this.config[who][what].replace(/(^\/)?(\/$)?/g, '');
      delete this.config[who][what];
    } else {
      this[what][who] = opt_default || null;
    }
  },

  getSourcePath: function (name, who) {
    var extension = who == 'JAVASCRIPT' ? 'js' : 'css';
    if (!new RegExp('\.' + extension + '$').exec(name)) {
      name += '.' + extension;
    }
    return [this.STATIC_DIR[who], name].filter(clean).join('/');
  },

  process: function (who) {
    var that = this;
    for (var key in this.config[who]) {
      _files[who][key] = this.config[who][key].map(function (PATH) {
        return fs.readFileSync(that.getSourcePath(PATH, who), 'UTF-8');
      }).join('\n');

      if (who == 'JAVASCRIPT'){
        _files[[who, 'RAW'].join('_')][key] = this.config[who][key].map(function (PATH) {
          return { path: PATH, fileContent: fs.readFileSync(that.getSourcePath(PATH, who), 'UTF-8') };
        });
      }

      try {
        _files[[who, 'OLD'].join('_')][key] = fs.readFileSync(_build.getBuildPath(key, who, false), 'UTF-8');
      } catch (e) {}
      try {
         _files[[who, 'MIN', 'OLD'].join('_')][key] = fs.readFileSync(_build.getBuildPath(key, who, true), 'UTF-8');
      } catch (e) {}

    }
  }

};



/**
  * _RUN OBJ IS _RUN YOU.
  */

var _run = {

  init: function (what) {
    if (!_config.config) {
      _write.noConfig();
      return module.exports;
    }
    this.jshint();
    return module.exports;
  },

  jshint: function () {
    _write.newLine();
    var bundles = _files.JAVASCRIPT_RAW, file;
    for (bundle in bundles) {
      bundles[bundle].forEach(function (file) {
        var errors = [];
        jshint(file.fileContent, _config.config.JSHINT_OPTS);
        jshint.errors.forEach(function (err) {
          if (err && err.reason != 'Expected an assignment or function call and instead saw an expression.') {
            errors.push(err);
          }
        });
        _write.jshint(file.path, errors);
      });
    }
  }

};



/**
  * _BUILD OBJ IS _BUILD YOU.
  */

var _build = {

  lastBuilt: null,

  init: function (what, who) {

    if (!_config.config) {
      _write.noConfig();
      return module.exports;
    }

    this.createDir(who);

    _write.newLine();

    switch (what && what.toLowerCase()) {
      case 'full':
      case 'uncompressed':
        this.lastBuilt = this.uncompressed(who);
        break;
      case 'compressed':
      case 'uglifyjs':
      case 'min':
        this.lastBuilt = this.compressed(who);
        break;
      default:
        this.uncompressed(who);
        this.lastBuilt = this.compressed(who);
    }

    _write.message('\n');

    return module.exports;
  },

  createDir: function (who) {
    var that = this;
    who = who ? [who] : ['JAVASCRIPT', 'CSS'];

    who.forEach(function (who) {
      if (!_config.config[who]) {
        return;
      }
      var dirPath = [_config.STATIC_DIR[who], _config.DIST_DIR[who]].filter(clean).join('/');
      try {
        fs.statSync(dirPath);
      } catch (e) {
        fs.mkdirSync(dirPath, 0775);
      }
    });
  },

  uncompressed: function (who) {
    var that = this;
    who = who ? [who] : ['JAVASCRIPT', 'CSS'];

    who.forEach(function (who) {
      for (file in _files[who]) {
        fs.writeFileSync(that.getBuildPath(file, who, false), _files[who][file]);
        _write.built('an uncompressed file', file);
      }
    });
  },

  compressed: function (who) {
    var that = this;
    who = who ? [who] : ['JAVASCRIPT', 'CSS'];

    who.forEach(function (who) {
      for (file in _files[who]) {
        if (who == 'JAVASCRIPT') {
          that.uglify(file, _files[who][file]);
        } else {
          //TODO: build compressed CSS
          fs.writeFileSync(that.getBuildPath(file, who, false), _files[who][file]);
          _write.built('an uncompressed file', file);
        }
      }
    });
  },

  uglify: function (file, file_contents) {
    var tok = uglifyJs.parser.tokenizer(file_contents)
      , c = tok();

    _files.JAVASCRIPT_MIN[file] = this.showCopyright(c.comments_before) || '';

    var ast = uglifyJs.parser.parse(file_contents);
    ast = uglifyJs.uglify.ast_mangle(ast);
    ast = uglifyJs.uglify.ast_squeeze(ast);

    _files.JAVASCRIPT_MIN[file] += uglifyJs.uglify.gen_code(ast);

    fs.writeFileSync(this.getBuildPath(file, 'JAVASCRIPT', true), _files.JAVASCRIPT_MIN[file]);
    _write.built('a minified file with uglifyJs', file);
  },

  getBuildPath: function (name, who, min) {
    var extension = who == 'JAVASCRIPT' ? 'js' : 'css'
      , min = min ? 'min' : null
      , version = _config.config.VERSION ? '-' + _config.config.VERSION : '';

    return [
      _config.STATIC_DIR[who],
      _config.DIST_DIR[who],
      [
        name + version,
        min,
        extension
      ].filter(clean).join('.')
    ].filter(clean).join('/');
  },

  showCopyright: function (comments) {
    var ret = "";
    for (var i = 0; i < comments.length; ++i) {
      var c = comments[i];
      if (c.type == "comment1") {
        ret += "//" + c.value + "\n";
      } else {
        ret += "/*" + c.value + "*/";
      }
    }
    return ret + '\n';
  }

};



/**
  * _ANALYZE OBJ IS ANALYZE YOU.
  */

var _analyze = {

  init: function (what, who) {
    if (!_config.config) {
      _write.noConfig();
      return module.exports;
    }

    _write.newLine();
    _write.message('Analyzing File Sizes...\n'.yellow)

    switch (what && what.toLowerCase()) {
      case 'full':
      case 'uncompressed':
        this.process('uncompressed', who);
        break;
      case 'compressed':
      case 'uglifyjs':
      case 'min':
        this.process('compressed', who);
        break;
      case 'gzip':
      case 'gzipped':
        this.gzipped(who);
        break;
      default:
        this.process('uncompressed', who);
        this.process('compressed', who);
        this.process('gzipped', who);
    }

    return module.exports;
  },

  process: function (what, who) {
    var that = this;
    who = who ? [who] : ['JAVASCRIPT', 'CSS'];

    who.forEach(function (who) {
      who += what != 'uncompressed' ? '_MIN' : '';
      var oldWho = [who, 'OLD'].join('_');
      if (what == 'gzipped') {
        that.gzipped(_files[who], _files[oldWho]);
      } else {
        for (file in _files[who]) {
          if (!_files[oldWho]) {
            return _write.noOldFiles(what, file);
          } else {
            _write.analysis(what, file, _files[oldWho][file] && _files[oldWho][file].length, _files[who][file].length)
          }
        }
      }
    });
  },

  gzipped: function (files, oldFiles){
    for (var file in files) {
      (function (file) {
        if (!oldFiles || !oldFiles[file]) {
          return _write.noOldFiles('gzipped', file);
        }
        gzip(oldFiles[file], function (err, data) {
          var oldGzipLen = data.length;
          gzip(files[file], function (err, data) {
            var newGzipLen = data.length;
            _write.analysis('gzipped', file, oldGzipLen, newGzipLen)
          });
        })
      }(file));
    }
  }

};



/**
  * _GET OBJ IS _GET YOU.
  */
var _get = {

  getFilePaths: function () {
    var that = this
      , result = {}
      , file
      , who
      , filter;

    if (/(JAVASCRIPT|CSS)/.exec(arguments[0])) {
      who = [arguments[0]];
    } else {
      who = ['JAVASCRIPT', 'CSS'];
      filter = arguments[0];
    }

    who.forEach(function (who) {
      result[who] = result[who] || {};

      if (!filter || /(FULL|UNCOMPRESSED)/.exec(filter)) {
        var _key = filter || 'UNCOMPRESSED';
        result[who][_key] = {};
        for (file in _files[who]) {
          result[who][_key][file] = _build.getBuildPath(file, who, false);
        }
      }

      if (!filter || /(MIN|COMPRESSED)/.exec(filter)) {
        var _key = filter || 'COMPRESSED';
        result[who][_key] = {};
        for (file in _files[who]) {
          result[who][_key][file] =_build.getBuildPath(file, who, true);
        }
      }

      if (!filter || /(RAW|UNPACKAGED)/.exec(filter)) {
        var _key = filter || 'UNPACKAGED';
        result[who][_key] = {};
        for (bundle in _config.config[who]) {
          var files = [];
          _config.config[who][bundle].forEach(function (file) {
            files.push(_config.getSourcePath(file, who));
          });
          result[who][_key][bundle] = files;
        }
      }
    });


    if (who.length == 1) {
      return result[who];
    } else {
      return result;
    }
  },

  init: function (who) {
    if (!_config.config) {
      _write.noConfig();
      return false;
    }

    who = who == 'all' ? false : who && who.toUpperCase();
    return this.getFilePaths(who);
  }

}


/**
  * _API OBJ IS _API YOU. (COME AT ME!)
  */

var _API = {

  make: function () {
    this.config.apply(this, arguments);
    this.run();
    this.build();
    this.analyze();
    return this;
  },

  clean: function (who) {
    var that = this;
    who = who ? [who] : ['JAVASCRIPT', 'CSS'];

    who.forEach(function (who) {
      try {
        rimraf.sync(_config.DIST_DIR[who])
      } catch (e) {} //don't freak out if no DIST_DIR yet...
    });
    return this;
  },

  config: bind(_config.init, _config),

  run: bind(_run.init, _run),

  build: bind(_build.init, _build),

  analyze: bind(_analyze.init, _analyze),

  get: bind(_get.init, _get)

};



/**
  * _INTERFACE OBJ IS INTERFACE YOU.
  */

var _interface = {

  terminal: function (args) {
    var flags;
    if (args[0][0] == '-') {
      flags = args[0].replace(/^\-/, '').split('');
    } else {
      flags = [args[0]];
    }

    flags.forEach(function(flag) {
      switch (flag) {
        case 'd':
        case 'clean':
          _API.clean();
          break;
        case 'c':
        case 'compressed':
        case 'compress':
        case 'min':
          _API.config(args[1]);
          _API.build('compressed');
          break;
        case 'f':
        case 'uncompressed':
        case 'uncompress':
        case 'full':
          _API.config(args[1]);
          _API.build('uncompressed');
          break;
        case 'b':
        case 'build':
          _API.config(args[1]);
          _API.build();
          break;
        case 'r':
        case 'run':
          _API.config(args[1]);
          _API.run();
          break;
        case 'm':
        case 'make':
          _API.make(args[1]);
          break;
        case 'a':
          try { _API.anaylze(); } catch (e) {
            _write.message('Something went wrong analyzing your file... are you sure you built something new first?'.red);
          }
          break;
        default:
          _API.make(args[0]);
      }
    });
  }
};



/**
  * EXPOSE HIS JUNK
  */

for (var key in _API) {
  module.exports[key] = _API[key];
}

for (var key in _interface) {
  module.exports[key] = _interface[key];
}
