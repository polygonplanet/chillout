module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: [
      'es6-shim',
      'mocha',
      'browserify',
      'detectBrowsers'
    ],
    files: [
      './test/chillout.spec.js'
    ],
    exclude: [],
    preprocessors: {
      './test/**/*.js': ['browserify']
    },
    client: {
      mocha: {
        reporter: 'html',
        ui: 'bdd'
      }
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: false,
    customLaunchers: {
      // Custom launchers for Travis
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function(availableBrowser) {
        if (process.env.TRAVIS) {
          return ['Chrome_travis_ci'];
        }
        return availableBrowser;
      }
    },
    plugins: [
      'karma-browserify',
      'karma-es6-shim',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-safari-launcher',
      'karma-detect-browsers'
    ],
    singleRun: true,
    concurrency: Infinity
  });
};
