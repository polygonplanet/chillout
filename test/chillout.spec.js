const assert = require('assert');
const chillout = require('../src/index');

describe('chillout', () => {
  it('should have valid main iteration methods', () => {
    assert(typeof chillout.forEach === 'function');
    assert(typeof chillout.repeat === 'function');
    assert(typeof chillout.until === 'function');
    assert(typeof chillout.waitUntil === 'function');
    assert(typeof chillout.forOf === 'function');
  });

  it('should have valid methods and properties', () => {
    assert(typeof chillout.StopIteration === 'object');
    assert(typeof chillout.iterate === 'function');
    assert(typeof chillout.iterator === 'object');
    assert(typeof chillout.isThenable === 'function');
    assert(typeof chillout.isArrayLike === 'function');
    assert(typeof chillout.nextTick === 'function');
  });
});
