module.exports = function (config) {
  config.set({
    frameworks: ["mocha", "sinon-chai"],
    // files: ["test/**/*.js"],
    files: ["test.js"],
    preprocessors: {
      "test.js": ["rollup"],
    },
    rollupPreprocessor: {
      /**
       * This is just a normal Rollup config object,
       * except that `input` is handled for you.
       */
      plugins: [require("rollup-plugin-html")()],
      output: {
        // format: 'iife', // Helps prevent naming collisions.
        // name: '<your_project>', // Required for 'iife' format.
        // sourcemap: 'inline', // Sensible for testing.
      },
    },

    reporters: ["spec"],
    specReporter: {
      maxLogLines: 5, // limit number of lines logged per test
      suppressErrorSummary: false, // do not print error summary
      suppressFailed: false, // do not print information about failed tests
      suppressPassed: false, // do not print information about passed tests
      suppressSkipped: true, // do not print information about skipped tests
      showSpecTiming: false, // print the time elapsed for each spec
      failFast: true, // test would finish with error when a first fail occurs.
    },

    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ["ChromeHeadless"],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,
  });
};
