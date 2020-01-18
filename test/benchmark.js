/* eslint no-console: "off" */
'use strict';

require('es6-shim');
var chillout = require('../dist/chillout');
var pidusage = require('pidusage');

var REPEAT_COUNT = 100;
var cpuLoads = {
  for_statement: [],
  chillout_repeat: []
};

// Get CPU usage for the current node process
function cpuStat(type) {
  return new Promise(function(resolve, reject) {
    pidusage.stat(process.pid, function(err, stat) {
      if (err) {
        console.log('[Error]');
        console.log(err);
        console.log('*** If you got an error on Windows, you may try succeed if you execute this benchmark several times.');
        process.exit(0);
      }

      cpuLoads[type].push(stat.cpu);
      resolve();
    });
  });
}

// Get CPU usage average
function cpuAvg(type) {
  var loads = cpuLoads[type].filter(function(load) {
    // Skip 0% load
    return load > 0;
  });

  var len = loads.length;
  if (len === 0) {
    return 'Failed to get CPU usage';
  }

  return (loads.reduce(function(total, load) {
    total += load;
    return total;
  }, 0) / len).toFixed(2) + '%';
}

function heavyProcess() {
  var v;
  for (var i = 0; i < 10000; i++) {
    for (var j = 0; j < 10000; j++) {
      v = i * j;
    }
  }
  return v;
}

// Repeat the slow processing by JavaScript ForStatement
function run_for_statement() {
  return run('JavaScript ForStatement', 'for_statement', function(stat) {
    return new Promise(function(resolve) {
      for (var i = 0; i < REPEAT_COUNT; i++) {
        heavyProcess();
        stat();
      }
      resolve();
    });
  });
}

// Repeat the slow processing by using chillout.repeat
function run_chillout_repeat() {
  return run('chillout.repeat', 'chillout_repeat', function(stat) {
    return chillout.repeat(REPEAT_COUNT, function() {
      heavyProcess();
      stat();
    });
  });
}

function run(title, type, cycle) {
  return new Promise(function(resolve, reject) {
    console.log('Repeat the slow processing by using %s:', title);

    var q = [];
    var stat = function() {
      q.push(cpuStat(type));
    };

    var time = Date.now();
    cycle(stat).then(function() {
      var processingTime = Date.now() - time;
      console.log('Repeated %d times', REPEAT_COUNT);
      console.log('Processing time: %dms', processingTime);

      Promise.all(q).then(function() {
        console.log('CPU usage on Node process (Average): %s', cpuAvg(type));
        cpuLoads[type].length = 0;
        q.length = 0;
        resolve();
      });
    }).catch(function(err) {
      console.error(err);
      reject(err);
    });
  });
}

function wait(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

console.log('(1) JavaScript for loop');
wait(3000).then(run_for_statement).then(function() {
  console.log('--------------------------------');
  console.log('(2) chillout.repeat');
  // Wait a little bit for cooling the CPU
  wait(3000).then(run_chillout_repeat).then(function() {
    process.exit(0);
  });
}).catch(function(e) {
  console.log(e);
  process.exit(0);
});
