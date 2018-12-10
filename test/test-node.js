'use strict';

require('es6-shim');
var semver = require('semver');

// Uses the `global` in order to run a common test in browser and node
global.chillout = require('../dist/chillout');
global.assert = require('power-assert');

require('./test');

// node.js is supported async function from v7.6.0
if (semver.gte(process.version, '7.6.0')) {
  require('./async-await-test');
} else {
  console.log('skip async / await test');
}
