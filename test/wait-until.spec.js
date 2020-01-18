const assert = require('assert');
const chillout = require('../src/index');

describe('waitUntil', function() {
  it('should be executed slowly than chillout.until', function(done) {
    var elapsedTime_until = 0;
    var elapsedTime_waitUntil = 0;

    function run_until() {
      return new Promise(function(resolve, reject) {
        var startTime = Date.now();
        var i = 0;
        chillout.until(function() {
          if (++i === 10) {
            elapsedTime_until = Date.now() - startTime;
            return chillout.StopIteration;
          }
        }).then(function() {
          resolve();
        });
      });
    }

    function run_waitUntil() {
      return new Promise(function(resolve, reject) {
        var startTime = Date.now();
        var i = 0;
        chillout.waitUntil(function() {
          if (++i === 10) {
            elapsedTime_waitUntil = Date.now() - startTime;
            return chillout.StopIteration;
          }
        }).then(function() {
          resolve();
        });
      });
    }

    Promise.all([run_until(), run_waitUntil()]).then(function() {
      assert(elapsedTime_until < elapsedTime_waitUntil);
      done();
    });
  });

  it('10 times', function(done) {
    var i = 0;
    chillout.waitUntil(function() {
      if (++i === 10) {
        return chillout.StopIteration;
      }
    }).then(function() {
      assert(i === 10);
      done();
    });
  });

  it('10 times with context', function(done) {
    var context = { i: 0 };
    chillout.waitUntil(function() {
      if (++this.i === 10) {
        return chillout.StopIteration;
      }
    }, context).then(function() {
      assert(context.i === 10);
      done();
    });
  });

  it('stop nested Promise iteration', function(done) {
    var i = 0;
    chillout.waitUntil(function() {
      if (++i === 10) {
        return new Promise(function(resolve, reject) {
          resolve(chillout.StopIteration);
        });
      }
    }).then(function() {
      assert(i === 10);
      done();
    });
  });

  it('throw an error', function(done) {
    chillout.waitUntil(function() {
      throw 'ok';
    }).then(function() {
      throw 'error';
    }).catch(function(e) {
      assert.equal(e, 'ok');
      done();
    });
  });
});
