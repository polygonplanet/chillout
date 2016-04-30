/* eslint no-console: "off" */
'use strict';

require('es6-shim');
var chillout = require('../dist/chillout');
var pusage = require('pidusage');

var REPEAT_COUNT = 50;
var cpuLoads = {
  without_chillout: [],
  using_chillout: []
};


// Get CPU load for current node process
function cpuStat(type) {
  return new Promise(function(resolve, reject) {
    pusage.stat(process.pid, function(err, stat) {
      if (err) {
        reject(err);
        return;
      }

      cpuLoads[type].push(stat.cpu);
      resolve();
    });
  });
}

// Get CPU load average
function cpuAvg(type) {
  var loads = cpuLoads[type].filter(function(load) {
    // Ignore 0% load
    return load > 0;
  });

  var len = loads.length;
  if (len === 0) {
    return 'Failed to get CPU load average';
  }

  return (loads.reduce(function(total, load) {
    total += load;
    return total;
  }, 0) / len).toFixed(2) + '%';
}


function heavyProcess() {
  /* eslint-disable no-unused-vars */
  var v;
  for (var i = 0; i < 10000; i++) {
    for (var j = 0; j < 10000; j++) {
      v = i * j;
    }
  }
  /* eslint-enable no-unused-vars */
}


// Repeat the heavy processing without chillout
function run_without_chillout() {
  return run('without chillout', 'without_chillout', function(stat) {
    return new Promise(function(resolve) {
      for (var i = 0; i < REPEAT_COUNT; i++) {
        heavyProcess();
        stat();
      }
      resolve();
    });
  });
}


// Repeat the heavy processing using chillout
function run_using_chillout() {
  return run('using chillout', 'using_chillout', function(stat) {
    return chillout.repeat(REPEAT_COUNT, function() {
      heavyProcess();
      stat();
    });
  });
}


function run(title, type, cycle) {
  return new Promise(function(resolve, reject) {
    console.log('Repeat the heavy processing %s:', title);

    var q = [];
    var stat = function() {
      q.push(cpuStat(type));
    };

    var time = Date.now();
    cycle(stat).then(function() {
      var processingTime = Date.now() - time;
      console.log('Repeated %d times', q.length);
      console.log('Processing time: %dms', processingTime);

      Promise.all(q).then(function() {
        console.log('CPU total average: %s', cpuAvg(type));
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
    setTimeout(function() {
      resolve();
    }, ms);
  });
}


wait(3000).then(run_without_chillout).then(function() {
  console.log('--------------------------------');
  // Wait a little bit for cooling CPU
  wait(3000).then(run_using_chillout);
});
