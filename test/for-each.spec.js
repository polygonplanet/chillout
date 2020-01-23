const assert = require('assert');
const chillout = require('../src/index');

describe('forEach', () => {
  it('array', done => {
    const values = [];
    const keys = [];
    chillout.forEach([1, 2, 3], (value, i) => {
      values.push(value);
      keys.push(i);
    }).then(() => {
      assert.deepEqual(values, [1, 2, 3]);
      assert.deepEqual(keys, [0, 1, 2]);
      done();
    });
  });

  it('object', done => {
    const values = [];
    const keys = [];
    chillout.forEach({ a: 1, b: 2, c: 3 }, (value, key) => {
      values.push(value);
      keys.push(key);
    }).then(() => {
      assert.deepEqual(values, [1, 2, 3]);
      assert.deepEqual(keys, ['a', 'b', 'c']);
      done();
    });
  });

  it('array-like object', done => {
    const values = [];
    const keys = [];
    chillout.forEach({ 0: 1, 1: 2, 2: 3, length: 3 }, (value, i) => {
      values.push(value);
      keys.push(i);
    }).then(() => {
      assert.deepEqual(values, [1, 2, 3]);
      assert.deepEqual(keys, [0, 1, 2]);
      done();
    });
  });

  it('array with context', done => {
    const context = {
      values: [],
      keys: []
    };
    chillout.forEach([1, 2, 3], function(value, i) {
      this.values.push(value);
      this.keys.push(i);
    }, context).then(() => {
      assert.deepEqual(context.values, [1, 2, 3]);
      assert.deepEqual(context.keys, [0, 1, 2]);
      done();
    });
  });

  it('object with context', done => {
    const context = {
      values: [],
      keys: []
    };
    chillout.forEach({ a: 1, b: 2, c: 3 }, function(value, key) {
      this.values.push(value);
      this.keys.push(key);
    }, context).then(() => {
      assert.deepEqual(context.values, [1, 2, 3]);
      assert.deepEqual(context.keys, ['a', 'b', 'c']);
      done();
    });
  });

  it('stop iteration (array)', done => {
    const values = [];
    const keys = [];
    chillout.forEach([1, 2, 3], (value, i) => {
      values.push(value);
      keys.push(i);
      if (value === 2) {
        return chillout.StopIteration;
      }
    }).then(() => {
      assert.deepEqual(values, [1, 2]);
      assert.deepEqual(keys, [0, 1]);
      done();
    });
  });

  it('stop nested Promise iteration (array)', done => {
    const values = [];
    const keys = [];
    chillout.forEach([1, 2, 3], (value, i) => {
      values.push(value);
      keys.push(i);
      if (value === 2) {
        return new Promise((resolve, reject) => {
          resolve(chillout.StopIteration);
        });
      }
    }).then(() => {
      assert.deepEqual(values, [1, 2]);
      assert.deepEqual(keys, [0, 1]);
      done();
    });
  });

  it('stop iteration (object)', done => {
    const values = [];
    const keys = [];
    chillout.forEach({ a: 1, b: 2, c: 3 }, (value, key) => {
      values.push(value);
      keys.push(key);
      if (value === 2) {
        return chillout.StopIteration;
      }
    }).then(() => {
      assert.deepEqual(values, [1, 2]);
      assert.deepEqual(keys, ['a', 'b']);
      done();
    });
  });

  it('stop nested Promise iteration (object)', done => {
    const values = [];
    const keys = [];
    chillout.forEach({ a: 1, b: 2, c: 3 }, (value, key) => {
      values.push(value);
      keys.push(key);
      if (value === 2) {
        return new Promise((resolve, reject) => {
          resolve(chillout.StopIteration);
        });
      }
    }).then(() => {
      assert.deepEqual(values, [1, 2]);
      assert.deepEqual(keys, ['a', 'b']);
      done();
    });
  });

  it('throw an error (array)', done => {
    chillout.forEach([1], (value, i) => {
      throw [i, value];
    }).then(() => {
      throw 'error';
    }).catch(e => {
      assert.deepEqual(e, [0, 1]);
      done();
    });
  });

  it('throw an error (object)', done => {
    chillout.forEach({ a: 1 }, (value, key) => {
      throw [key, value];
    }).then(() => {
      throw 'error';
    }).catch(e => {
      assert.deepEqual(e, ['a', 1]);
      done();
    });
  });
});
