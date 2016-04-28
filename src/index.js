import iterator from './iterator';
import iterate from './iterate';

/**
 * Executes a provided function once per array or object element.
 * The iteration will break if the callback function returns `false`.
 *
 * @param {Array|Object} obj Target array or object.
 * @param {Function} callback Function to execute for each element, taking
 *   three arguments:
 * - value: The current element being processed in the array/object.
 * - key: The key of the current element being processed in the array/object.
 * - obj: The array/object that `each` is being applied to.
 * @param {Object} [context] Value to use as `this` when executing callback.
 * @return {Promise} Return new Promise.
 */
export function each(obj, callback, context) {
  return iterate(iterator.each(obj, callback, context));
}

/**
 * Executes a provided function the specified number times.
 * The iteration will break if the callback function returns `false`.
 *
 * @param {number|Object} count The number of times or object for execute the
 *   function. Following parameters are available if specify object:
 * - start: The number of start.
 * - step: The number of step.
 * - end: The number of end.
 * @param {Function} callback Function to execute for each times, taking an
 *   argument:
 * - i: The current number.
 * @param {Object} [context] Value to use as `this` when executing callback.
 * @return {Promise} Return new Promise.
 */
export function repeat(count, callback, context) {
  return iterate(iterator.repeat(count, callback, context));
}

/**
 * Executes a provided function forever.
 * The iteration will break if the callback function returns `false`.
 *
 * @param {Function} callback The function that is executed for each iteration.
 * @param {Object} [context] Value to use as `this` when executing callback.
 * @return {Promise} Return new Promise.
 */
export function forever(callback, context) {
  return iterate(iterator.forever(callback, context));
}
