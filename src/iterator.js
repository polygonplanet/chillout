import { isArrayLike } from './util';
import StopIteration from './stop-iteration';

export function forEach(obj, callback, context) {
  let i = 0;
  let len;

  if (isArrayLike(obj)) {
    len = obj.length;

    return {
      next() {
        if (i >= len) {
          return [StopIteration, null];
        }

        const res = callback.call(context, obj[i], i, obj);
        i++;
        return [null, res];
      }
    };
  }

  const keys = Object.keys(obj);
  len = keys.length;

  return {
    next() {
      if (i >= len) {
        return [StopIteration, null];
      }

      const key = keys[i++];
      const res = callback.call(context, obj[key], key, obj);
      return [null, res];
    }
  };
}

export function repeat(count, callback, context) {
  let i;
  let step;
  let end;

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
        return [StopIteration, res];
      }
      return [null, res];
    }
  };
}

export function till(callback, context) {
  return {
    next() {
      const res = callback.call(context);
      return [null, res];
    }
  };
}

export function forOf(iterable, callback, context) {
  const it = iterable[Symbol.iterator]();

  return {
    next() {
      const nextIterator = it.next();

      if (nextIterator.done) {
        return [StopIteration, null];
      }
      const res = callback.call(context, nextIterator.value, iterable);
      return [null, res];
    }
  };
}
