'use strict';

require('es6-shim');

// Uses the `global` in order to run a common test in browser and node
global.chillout = require('../dist/chillout');
global.assert = require('power-assert');

require('./test');
