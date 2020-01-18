const assert = require('assert');
const chillout = require('../src/index');

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

  it('stop nested Promise iteration (array)', function(done) {
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

  it('stop nested Promise iteration (object)', function(done) {
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

  it('throw an error (array)', function(done) {
    chillout.forEach([1], function(value, i) {
      throw [i, value];
    }).then(function() {
      throw 'error';
    }).catch(function(e) {
      assert.deepEqual(e, [0, 1]);
      done();
    });
  });

  it('throw an error (object)', function(done) {
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
