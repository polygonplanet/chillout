const assert = require('assert');

if (!isAsyncSupported()) {
  it('skipped tests: async/await is not supported in this environment', () => {
    assert(true);
  });
} else {
  require('./async-await-test');
}

function isAsyncSupported() {
  try {
    eval('async () => {}');
  } catch (e) {
    if (e instanceof SyntaxError) {
      return false;
    } else {
      // throws CSP error
      return true;
    }
  }
  return true;
}
