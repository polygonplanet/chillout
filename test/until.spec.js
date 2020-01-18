const assert = require('assert');
const chillout = require('../src/index');

describe('until', function() {
  it('10 times', function(done) {
    var i = 0;
    chillout.until(function() {
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
    chillout.until(function() {
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
    chillout.until(function() {
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
    chillout.until(function() {
      throw 'ok';
    }).then(function() {
      throw 'error';
    }).catch(function(e) {
      assert.equal(e, 'ok');
      done();
    });
  });
});
