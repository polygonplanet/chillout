const assert = require('assert');
const chillout = require('../src/index');

describe('forOf', function() {
  if (typeof Symbol === 'undefined') {
    return it('skip', function() {
      assert(true);
    });
  }

  it('array', function(done) {
    var values = [];
    chillout.forOf([1, 2, 3], function(value) {
      values.push(value);
    }).then(function() {
      assert.deepEqual(values, [1, 2, 3]);
      done();
    });
  });

  it('string', function(done) {
    var values = [];
    chillout.forOf('abc', function(value) {
      values.push(value);
    }).then(function() {
      assert.deepEqual(values, ['a', 'b', 'c']);
      done();
    });
  });

  it('TypedArray', function(done) {
    var values = [];
    var iterable = new Uint8Array([0x00, 0xff]);

    if (typeof iterable[Symbol.iterator] !== 'function') {
      // skip
      assert(true);
      done();
      return;
    }

    chillout.forOf(iterable, function(value) {
      values.push(value);
    }).then(function() {
      assert.deepEqual(values, [0, 255]);
      done();
    });
  });

  it('Map', function(done) {
    var values = [];
    var iterable = new Map([['a', 1], ['b', 2], ['c', 3]]);
    chillout.forOf(iterable, function(value) {
      values.push(value);
    }).then(function() {
      assert.deepEqual(values, [['a', 1], ['b', 2], ['c', 3]]);
      done();
    });
  });

  it('Set', function(done) {
    var values = [];
    var iterable = new Set([1, 1, 2, 2, 3, 3]);
    chillout.forOf(iterable, function(value) {
      values.push(value);
    }).then(function() {
      assert.deepEqual(values, [1, 2, 3]);
      done();
    });
  });

  it('specify context', function(done) {
    var context = {
      values: []
    };
    chillout.forOf([1, 2, 3], function(value) {
      this.values.push(value);
    }, context).then(function() {
      assert.deepEqual(context.values, [1, 2, 3]);
      done();
    });
  });

  it('stop iteration', function(done) {
    var values = [];
    chillout.forOf([1, 2, 3, 4, 5], function(value) {
      values.push(value);
      if (value === 3) {
        return chillout.StopIteration;
      }
    }).then(function() {
      assert.deepEqual(values, [1, 2, 3]);
      done();
    });
  });

  it('stop nested Promise iteration', function(done) {
    var values = [];
    chillout.forOf([1, 2, 3, 4, 5], function(value) {
      values.push(value);
      if (value === 3) {
        return new Promise(function(resolve, reject) {
          resolve(chillout.StopIteration);
        });
      }
    }).then(function() {
      assert.deepEqual(values, [1, 2, 3]);
      done();
    });
  });
});
