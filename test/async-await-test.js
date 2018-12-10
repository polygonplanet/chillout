/*global describe, beforeEach, afterEach, it, assert*/

const chillout = require('../dist/chillout');
const assert = require('power-assert');

describe('async / await', function() {
  'use strict';

  this.timeout(10 * 1000);


  function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }

  // Check whether the callback order does not change with async sleep
  async function checkSleep() {
    const startTime = Date.now();
    await sleep(100);
    const elapsedTime = Date.now() - startTime;
    // Includes the time lag
    assert(elapsedTime >= 90);
  }


  describe('forEach', () => {
    it('native forEach', done => {
      async function test_native_forEach() {
        const logs = [];
        logs.push('start');

        // Native forEach does not work expect order in multiple  asynchronous callbacks
        await [1, 2, 3].forEach(async value => {
          await checkSleep();
          logs.push(value);
        });

        logs.push('done');
        return logs;
      }

      (async () => {
        const logs = await test_native_forEach();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 'done', 'done func']);
        done();
      })();
    });

    it('chillout.forEach', done => {
      async function test_chillout_forEach() {
        const logs = [];
        logs.push('start');

        await chillout.forEach([1, 2, 3], async value => {
          await checkSleep();
          logs.push(value);
        });
        logs.push('done');
        return logs;
      }

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
      async function test_native_forLoop() {
        const logs = [];
        logs.push('start');

        for (const i of [0, 1, 2]) {
          await checkSleep();
          logs.push(i);
        }

        logs.push('done');
        return logs;
      }

      (async () => {
        const logs = await test_native_forLoop();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 0, 1, 2, 'done', 'done func']);
        done();
      })();
    });

    it('chillout.repeat', done => {
      async function test_chillout_repeat() {
        const logs = [];
        logs.push('start');

        await chillout.repeat(3, async i => {
          await checkSleep();
          logs.push(i);
        });

        logs.push('done');
        return logs;
      }

      (async () => {
        const logs = await test_chillout_repeat();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 0, 1, 2, 'done', 'done func']);
        done();
      })();
    });
  });


  describe('till', () => {
    it('native while', done => {
      async function test_native_whileLoop() {
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
      }

      (async () => {
        const logs = await test_native_whileLoop();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 0, 1, 2, 'done', 'done func']);
        done();
      })();
    });

    it('chillout.till', done => {
      async function test_chillout_till() {
        const logs = [];
        logs.push('start');

        let i = 0;
        await chillout.till(async () => {
          await checkSleep();
          logs.push(i);
          i++;
          if (i === 3) {
            return false;
          }
        });

        logs.push('done');
        return logs;
      }

      (async () => {
        const logs = await test_chillout_till();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 0, 1, 2, 'done', 'done func']);
        done();
      })();
    });
  });


  describe('forOf', () => {
    it('native for-of loop', done => {
      async function test_native_forOfLoop() {
        const logs = [];
        logs.push('start');

        for (const value of [1, 2, 3]) {
          await checkSleep();
          logs.push(value);
        }

        logs.push('done');
        return logs;
      }

      (async () => {
        const logs = await test_native_forOfLoop();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 1, 2, 3, 'done', 'done func']);
        done();
      })();
    });

    it('chillout.forOf', done => {
      async function test_chillout_forOf() {
        const logs = [];
        logs.push('start');

        await chillout.forOf([1, 2, 3], async value => {
          await checkSleep();
          logs.push(value);
        });

        logs.push('done');
        return logs;
      }

      (async () => {
        const logs = await test_chillout_forOf();
        logs.push('done func');
        assert.deepEqual(logs, ['start', 1, 2, 3, 'done', 'done func']);
        done();
      })();
    });
  });
});
