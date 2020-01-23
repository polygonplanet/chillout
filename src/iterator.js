const { isArrayLike } = require('./util');

exports.forEach = function(obj, callback, context) {
  let i = 0;
  let len;

  if (isArrayLike(obj)) {
    len = obj.length;

    return {
      next() {
        if (i >= len) {
          return [true, null];
        }

        const value = callback.call(context, obj[i], i, obj);
        i++;
        return [false, value];
      }
    };
  }

  const keys = Object.keys(obj);
  len = keys.length;

  return {
    next() {
      if (i >= len) {
        return [true, null];
      }

      const key = keys[i++];
      const value = callback.call(context, obj[key], key, obj);
      return [false, value];
    }
  };
};

exports.repeat = function(count, callback, context) {
  let i;
  let step;
  let done;

  if (count && typeof count === 'object') {
    i = count.start || 0;
    step = count.step || 1;
    done = count.done;
  } else {
    i = 0;
    step = 1;
    done = count;
  }

  return {
    next() {
      const value = callback.call(context, i);

      i += step;
      if (i >= done) {
        return [true, value];
      }
      return [false, value];
    }
  };
};

exports.until = function(callback, context) {
  return {
    next() {
      const value = callback.call(context);
      return [false, value];
    }
  };
};

exports.forOf = function(iterable, callback, context) {
  const it = iterable[Symbol.iterator]();

  return {
    next() {
      const nextIterator = it.next();

      if (nextIterator.done) {
        return [true, null];
      }
      const value = callback.call(context, nextIterator.value, iterable);
      return [false, value];
    }
  };
};
