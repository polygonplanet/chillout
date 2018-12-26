/* global describe, it, assert, chillout */

describe('chillout test', function() {
  'use strict';

  describe('forEach', function() {
    it('array', function(done) {
      var values = [];
      var keys = [];
      chillout.forEach([1, 2, 3], function(value, i) {
        values.push(value);
        keys.push(i);
      }).then(function() {
        assert.deepEqual(values, [1, 2, 3]);
        assert.deepEqual(keys, [0, 1, 2]);
        done();
      });
    });

    it('object', function(done) {
      var values = [];
      var keys = [];
      chillout.forEach({ a: 1, b: 2, c: 3 }, function(value, key) {
        values.push(value);
        keys.push(key);
      }).then(function() {
        assert.deepEqual(values, [1, 2, 3]);
        assert.deepEqual(keys, ['a', 'b', 'c']);
        done();
      });
    });

    it('array-like object', function(done) {
      var values = [];
      var keys = [];
      chillout.forEach({ 0: 1, 1: 2, 2: 3, length: 3 }, function(value, i) {
        values.push(value);
        keys.push(i);
      }).then(function() {
        assert.deepEqual(values, [1, 2, 3]);
        assert.deepEqual(keys, [0, 1, 2]);
        done();
      });
    });

    it('array with context', function(done) {
      var context = {
        values: [],
        keys: []
      };
      chillout.forEach([1, 2, 3], function(value, i) {
        this.values.push(value);
        this.keys.push(i);
      }, context).then(function() {
        assert.deepEqual(context.values, [1, 2, 3]);
        assert.deepEqual(context.keys, [0, 1, 2]);
        done();
      });
    });

    it('object with context', function(done) {
      var context = {
        values: [],
        keys: []
      };
      chillout.forEach({ a: 1, b: 2, c: 3 }, function(value, key) {
        this.values.push(value);
        this.keys.push(key);
      }, context).then(function() {
        assert.deepEqual(context.values, [1, 2, 3]);
        assert.deepEqual(context.keys, ['a', 'b', 'c']);
        done();
      });
    });

    it('stop iteration (array)', function(done) {
      var values = [];
      var keys = [];
      chillout.forEach([1, 2, 3], function(value, i) {
        values.push(value);
        keys.push(i);
        if (value === 2) {
          return chillout.StopIteration;
        }
      }).then(function() {
        assert.deepEqual(values, [1, 2]);
        assert.deepEqual(keys, [0, 1]);
        done();
      });
    });

    it('stop nested iteration (array)', function(done) {
      var values = [];
      var keys = [];
      chillout.forEach([1, 2, 3], function(value, i) {
        values.push(value);
        keys.push(i);
        if (value === 2) {
          return new Promise(function(resolve, reject) {
            resolve(chillout.StopIteration);
          });
        }
      }).then(function() {
        assert.deepEqual(values, [1, 2]);
        assert.deepEqual(keys, [0, 1]);
        done();
      });
    });

    it('stop iteration (object)', function(done) {
      var values = [];
      var keys = [];
      chillout.forEach({ a: 1, b: 2, c: 3 }, function(value, key) {
        values.push(value);
        keys.push(key);
        if (value === 2) {
          return chillout.StopIteration;
        }
      }).then(function() {
        assert.deepEqual(values, [1, 2]);
        assert.deepEqual(keys, ['a', 'b']);
        done();
      });
    });

    it('stop nested iteration (object)', function(done) {
      var values = [];
      var keys = [];
      chillout.forEach({ a: 1, b: 2, c: 3 }, function(value, key) {
        values.push(value);
        keys.push(key);
        if (value === 2) {
          return new Promise(function(resolve, reject) {
            resolve(chillout.StopIteration);
          });
        }
      }).then(function() {
        assert.deepEqual(values, [1, 2]);
        assert.deepEqual(keys, ['a', 'b']);
        done();
      });
    });

    it('throw (array)', function(done) {
      chillout.forEach([1], function(value, i) {
        throw [i, value];
      }).then(function() {
        throw 'error';
      }).catch(function(e) {
        assert.deepEqual(e, [0, 1]);
        done();
      });
    });

    it('throw (object)', function(done) {
      chillout.forEach({ a: 1 }, function(value, key) {
        throw [key, value];
      }).then(function() {
        throw 'error';
      }).catch(function(e) {
        assert.deepEqual(e, ['a', 1]);
        done();
      });
    });
  });

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
      chillout.repeat({ start: 10, step: 2, end: 20 }, function(i) {
        assert(n === i);
        n += 2;
      }).then(function() {
        assert(n === 20);
        done();
      });
    });

    it('with context', function(done) {
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

    it('throw', function(done) {
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

  describe('till', function() {
    it('10 times', function(done) {
      var i = 0;
      chillout.till(function() {
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
      chillout.till(function() {
        if (++this.i === 10) {
          return chillout.StopIteration;
        }
      }, context).then(function() {
        assert(context.i === 10);
        done();
      });
    });

    it('throw', function(done) {
      chillout.till(function() {
        throw 'ok';
      }).then(function() {
        throw 'error';
      }).catch(function(e) {
        assert.equal(e, 'ok');
        done();
      });
    });
  });

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

    it('with context', function(done) {
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
  });
});
