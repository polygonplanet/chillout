export function isThenable(x) {
  return x != null && typeof x.then === 'function';
}

export function isArrayLike(x) {
  return x != null && typeof x.length === 'number' && x.length >= 0;
}
