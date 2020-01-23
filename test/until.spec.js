const assert = require('assert');
const chillout = require('../src/index');

describe('until', () => {
  it('10 times', done => {
    let i = 0;
    chillout.until(() => {
      if (++i === 10) {
        return chillout.StopIteration;
      }
    }).then(() => {
      assert(i === 10);
      done();
    });
  });

  it('10 times with context', done => {
    const context = { i: 0 };
    chillout.until(function() {
      if (++this.i === 10) {
        return chillout.StopIteration;
      }
    }, context).then(() => {
      assert(context.i === 10);
      done();
    });
  });

  it('stop nested Promise iteration', done => {
    let i = 0;
    chillout.until(() => {
      if (++i === 10) {
        return new Promise((resolve, reject) => {
          resolve(chillout.StopIteration);
        });
      }
    }).then(() => {
      assert(i === 10);
      done();
    });
  });

  it('throw an error', done => {
    chillout.until(() => {
      throw 'ok';
    }).then(() => {
      throw 'error';
    }).catch(e => {
      assert.equal(e, 'ok');
      done();
    });
  });
});
