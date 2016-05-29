import { isArrayLike } from './util';

export function forEach(obj, callback, context) {
  let i = 0;
  let len;

  if (isArrayLike(obj)) {
    len = obj.length;

    return {
      next() {
        if (i >= len) {
          return false;
        }
        return callback.call(context, obj[i], i++, obj);
      }
    };
  }

  const keys = Object.keys(obj);
  len = keys.length;

  return {
    next() {
      if (i >= len) {
        return false;
      }

      const key = keys[i++];
      return callback.call(context, obj[key], key, obj);
    }
  };
}

export function repeat(count, callback, context) {
  let i, step, end;

  if (count && typeof count === 'object') {
    i = count.start || 0;
    step = count.step || 1;
    end = count.end;
  } else {
    i = 0;
    step = 1;
    end = count;
  }

  return {
    next() {
      const res = callback.call(context, i);

      i += step;
      if (i >= end) {
        return false;
      }
      return res;
    }
  };
}

export function till(callback, context) {
  return {
    next() {
      return callback.call(context);
    }
  };
}
