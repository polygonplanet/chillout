const assert = require('assert');
const chillout = require('../src/index');

describe('repeat', function() {
  it('specify number', function(done) {
    var n = 0;
    chillout.repeat(5, function(i) {
      assert(n++ === i);
    }).then(function() {
      assert(n === 5);
      done();
    });
  });

  it('specify object', function(done) {
    var n = 10;
    chillout.repeat({ start: 10, step: 2, done: 20 }, function(i) {
      assert(n === i);
      n += 2;
    }).then(function() {
      assert(n === 20);
      done();
    });
  });

  it('specify context', function(done) {
    var context = {
      n: 0
    };
    chillout.repeat(5, function(i) {
      assert(this.n++ === i);
    }, context).then(function() {
      assert(context.n === 5);
      done();
    });
  });

  it('stop iteration', function(done) {
    var n = 0;
    chillout.repeat(5, function(i) {
      assert(n++ === i);
      if (n === 3) {
        return chillout.StopIteration;
      }
    }).then(function() {
      assert(n === 3);
      done();
    });
  });

  it('stop nested Promise iteration', function(done) {
    var n = 0;
    chillout.repeat(5, function(i) {
      assert(n++ === i);
      if (n === 3) {
        return new Promise(function(resolve, reject) {
          resolve(chillout.StopIteration);
        });
      }
    }).then(function() {
      assert(n === 3);
      done();
    });
  });

  it('throw an error', function(done) {
    chillout.repeat(5, function(i) {
      throw 'ok';
    }).then(function() {
      throw 'error';
    }).catch(function(e) {
      assert.equal(e, 'ok');
      done();
    });
  });
});
