const assert = require('assert');
const chillout = require('../src/index');

describe('forOf', () => {
  if (typeof Symbol === 'undefined') {
    return it('skip', () => {
      assert(true);
    });
  }

  it('array', done => {
    const values = [];
    chillout.forOf([1, 2, 3], value => {
      values.push(value);
    }).then(() => {
      assert.deepEqual(values, [1, 2, 3]);
      done();
    });
  });

  it('string', done => {
    const values = [];
    chillout.forOf('abc', value => {
      values.push(value);
    }).then(() => {
      assert.deepEqual(values, ['a', 'b', 'c']);
      done();
    });
  });

  it('TypedArray', done => {
    const values = [];
    const iterable = new Uint8Array([0x00, 0xff]);

    if (typeof iterable[Symbol.iterator] !== 'function') {
      // skip
      assert(true);
      done();
      return;
    }

    chillout.forOf(iterable, value => {
      values.push(value);
    }).then(() => {
      assert.deepEqual(values, [0, 255]);
      done();
    });
  });

  it('Map', done => {
    const values = [];
    const iterable = new Map([['a', 1], ['b', 2], ['c', 3]]);
    chillout.forOf(iterable, value => {
      values.push(value);
    }).then(() => {
      assert.deepEqual(values, [['a', 1], ['b', 2], ['c', 3]]);
      done();
    });
  });

  it('Set', done => {
    const values = [];
    const iterable = new Set([1, 1, 2, 2, 3, 3]);
    chillout.forOf(iterable, value => {
      values.push(value);
    }).then(() => {
      assert.deepEqual(values, [1, 2, 3]);
      done();
    });
  });

  it('specify context', done => {
    const context = {
      values: []
    };
    chillout.forOf([1, 2, 3], function(value) {
      this.values.push(value);
    }, context).then(() => {
      assert.deepEqual(context.values, [1, 2, 3]);
      done();
    });
  });

  it('stop iteration', done => {
    const values = [];
    chillout.forOf([1, 2, 3, 4, 5], value => {
      values.push(value);
      if (value === 3) {
        return chillout.StopIteration;
      }
    }).then(() => {
      assert.deepEqual(values, [1, 2, 3]);
      done();
    });
  });

  it('stop nested Promise iteration', done => {
    const values = [];
    chillout.forOf([1, 2, 3, 4, 5], value => {
      values.push(value);
      if (value === 3) {
        return new Promise((resolve, reject) => {
          resolve(chillout.StopIteration);
        });
      }
    }).then(() => {
      assert.deepEqual(values, [1, 2, 3]);
      done();
    });
  });
});
