const assert = require('assert');
const chillout = require('../src/index');

describe('async / await', () => {
  const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

  // Check whether the callback order does not change with async sleep
  const checkSleep = async () => {
    const startTime = Date.now();
    await sleep(100);
    const elapsedTime = Date.now() - startTime;
    // Includes the time lag
    assert(elapsedTime >= 90);
  };

  describe('forEach', () => {
    it('native forEach', done => {
      const test_native_forEach = async () => {
        const logs = [];
        logs.push('start');

        // Native forEach does not work expect order in multiple asynchronous callbacks
        await [1, 2, 3].forEach(async value => {
          await checkSleep();
          logs.push(value);
        });

        logs.push('done');
        return logs;
      };

      (async () => {
        const logs = await test_native_forEach();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 'done', 'done func']);
        done();
      })();
    });

    it('chillout.forEach', done => {
      const test_chillout_forEach = async () => {
        const logs = [];
        logs.push('start');

        await chillout.forEach([1, 2, 3], async value => {
          await checkSleep();
          logs.push(value);
        });
        logs.push('done');
        return logs;
      };

      (async () => {
        const logs = await test_chillout_forEach();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 1, 2, 3, 'done', 'done func']);
        done();
      })();
    });
  });


  describe('repeat', () => {
    it('native for loop', done => {
      const test_native_forLoop = async () => {
        const logs = [];
        logs.push('start');

        for (const i of [0, 1, 2]) {
          await checkSleep();
          logs.push(i);
        }

        logs.push('done');
        return logs;
      };

      (async () => {
        const logs = await test_native_forLoop();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 0, 1, 2, 'done', 'done func']);
        done();
      })();
    });

    it('chillout.repeat', done => {
      const test_chillout_repeat = async () => {
        const logs = [];
        logs.push('start');

        await chillout.repeat(3, async i => {
          await checkSleep();
          logs.push(i);
        });

        logs.push('done');
        return logs;
      };

      (async () => {
        const logs = await test_chillout_repeat();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 0, 1, 2, 'done', 'done func']);
        done();
      })();
    });
  });


  describe('until', () => {
    it('native while', done => {
      const test_native_whileLoop = async () => {
        const logs = [];
        logs.push('start');

        let i = 0;
        while (i !== 3) {
          await checkSleep();
          logs.push(i);
          i++;
        }

        logs.push('done');
        return logs;
      };

      (async () => {
        const logs = await test_native_whileLoop();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 0, 1, 2, 'done', 'done func']);
        done();
      })();
    });

    it('chillout.until', done => {
      const test_chillout_until = async () => {
        const logs = [];
        logs.push('start');

        let i = 0;
        await chillout.until(async () => {
          await checkSleep();
          logs.push(i);
          i++;
          if (i === 3) {
            return chillout.StopIteration;
          }
        });

        logs.push('done');
        return logs;
      };

      (async () => {
        const logs = await test_chillout_until();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 0, 1, 2, 'done', 'done func']);
        done();
      })();
    });
  });


  describe('waitUntil', () => {
    it('native while', done => {
      const test_native_whileLoop = async () => {
        const logs = [];
        logs.push('start');

        let i = 0;
        while (i !== 3) {
          await checkSleep();
          logs.push(i);
          i++;
        }

        logs.push('done');
        return logs;
      };

      (async () => {
        const logs = await test_native_whileLoop();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 0, 1, 2, 'done', 'done func']);
        done();
      })();
    });

    it('chillout.waitUntil', done => {
      const test_chillout_waitUntil = async () => {
        const logs = [];
        logs.push('start');

        let i = 0;
        await chillout.waitUntil(async () => {
          await checkSleep();
          logs.push(i);
          i++;
          if (i === 3) {
            return chillout.StopIteration;
          }
        });

        logs.push('done');
        return logs;
      };

      (async () => {
        const logs = await test_chillout_waitUntil();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 0, 1, 2, 'done', 'done func']);
        done();
      })();
    });
  });

  describe('forOf', () => {
    it('native for-of loop', done => {
      const test_native_forOfLoop = async () => {
        const logs = [];
        logs.push('start');

        for (const value of [1, 2, 3]) {
          await checkSleep();
          logs.push(value);
        }

        logs.push('done');
        return logs;
      };

      (async () => {
        const logs = await test_native_forOfLoop();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 1, 2, 3, 'done', 'done func']);
        done();
      })();
    });

    it('chillout.forOf', done => {
      const test_chillout_forOf = async () => {
        const logs = [];
        logs.push('start');

        await chillout.forOf([1, 2, 3], async value => {
          await checkSleep();
          logs.push(value);
        });

        logs.push('done');
        return logs;
      };

      (async () => {
        const logs = await test_chillout_forOf();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 1, 2, 3, 'done', 'done func']);
        done();
      })();
    });
  });
});
