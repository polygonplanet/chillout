const assert = require('assert');
const chillout = require('../src/index');

describe('waitUntil', () => {
  it('should be executed slowly than chillout.until', done => {
    let elapsedTime_until = 0;
    let elapsedTime_waitUntil = 0;

    function run_until() {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        let i = 0;
        chillout.until(() => {
          if (++i === 10) {
            elapsedTime_until = Date.now() - startTime;
            return chillout.StopIteration;
          }
        }).then(() => {
          resolve();
        });
      });
    }

    function run_waitUntil() {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        let i = 0;
        chillout.waitUntil(() => {
          if (++i === 10) {
            elapsedTime_waitUntil = Date.now() - startTime;
            return chillout.StopIteration;
          }
        }).then(() => {
          resolve();
        });
      });
    }

    Promise.all([run_until(), run_waitUntil()]).then(() => {
      assert(elapsedTime_until < elapsedTime_waitUntil);
      done();
    });
  });

  it('10 times', done => {
    let i = 0;
    chillout.waitUntil(() => {
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
    chillout.waitUntil(function() {
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
    chillout.waitUntil(() => {
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
    chillout.waitUntil(() => {
      throw 'ok';
    }).then(() => {
      throw 'error';
    }).catch(e => {
      assert.equal(e, 'ok');
      done();
    });
  });
});
