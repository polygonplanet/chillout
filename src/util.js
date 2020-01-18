exports.isThenable = function isThenable(x) {
  return x != null && typeof x.then === 'function';
};

exports.isArrayLike = function isArrayLike(x) {
  return x != null && typeof x.length === 'number' && x.length >= 0;
};
