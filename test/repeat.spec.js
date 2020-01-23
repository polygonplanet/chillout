const assert = require('assert');
const chillout = require('../src/index');

describe('repeat', () => {
  it('specify number', done => {
    let n = 0;
    chillout.repeat(5, i => {
      assert(n++ === i);
    }).then(() => {
      assert(n === 5);
      done();
    });
  });

  it('specify object', done => {
    let n = 10;
    chillout.repeat({ start: 10, step: 2, done: 20 }, i => {
      assert(n === i);
      n += 2;
    }).then(() => {
      assert(n === 20);
      done();
    });
  });

  it('specify context', done => {
    const context = {
      n: 0
    };
    chillout.repeat(5, function(i) {
      assert(this.n++ === i);
    }, context).then(() => {
      assert(context.n === 5);
      done();
    });
  });

  it('stop iteration', done => {
    let n = 0;
    chillout.repeat(5, i => {
      assert(n++ === i);
      if (n === 3) {
        return chillout.StopIteration;
      }
    }).then(() => {
      assert(n === 3);
      done();
    });
  });

  it('stop nested Promise iteration', done => {
    let n = 0;
    chillout.repeat(5, i => {
      assert(n++ === i);
      if (n === 3) {
        return new Promise((resolve, reject) => {
          resolve(chillout.StopIteration);
        });
      }
    }).then(() => {
      assert(n === 3);
      done();
    });
  });

  it('throw an error', done => {
    chillout.repeat(5, i => {
      throw 'ok';
    }).then(() => {
      throw 'error';
    }).catch(e => {
      assert.equal(e, 'ok');
      done();
    });
  });
});
