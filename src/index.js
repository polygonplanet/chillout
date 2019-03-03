import * as iterator from './iterator';
import iterate from './iterate';
import { isThenable, isArrayLike } from './util';
import nextTick from './next-tick';
import StopIteration from './stop-iteration';

/**
 * Executes a provided function once per array or object element.
 * The iteration will break if the callback function returns `chillout.StopIteration`,
 *  or an error occurs.
 * This method can be called like JavaScript `Array forEach`.
 *
 * @param {Array|Object} obj Target array or object
 * @param {Function} callback Function to execute for each element, taking three arguments:
 * - value: The current element being processed in the array/object
 * - key: The key of the current element being processed in the array/object
 * - obj: The array/object that `forEach` is being applied to
 * @param {Object} [context] Value to use as `this` when executing callback
 * @return {Promise} Return new Promise
 */
export function forEach(obj, callback, context) {
  return iterate(iterator.forEach(obj, callback, context));
}

/**
 * Executes a provided function the specified number times.
 * The iteration will break if the callback function returns `chillout.StopIteration`,
 *  or an error occurs.
 * This method can be called like JavaScript `for` statement.
 *
 * @param {number|Object} count The number of times or object for execute the
 *   function. Following parameters are available if specify object:
 * - start: The number of start
 * - step: The number of step
 * - end: The number of end
 * @param {Function} callback Function to execute for each times, taking one argument:
 * - i: The current number
 * @param {Object} [context] Value to use as `this` when executing callback
 * @return {Promise} Return new Promise
 */
export function repeat(count, callback, context) {
  return iterate(iterator.repeat(count, callback, context));
}

/**
 * Executes a provided function until the `callback` returns `chillout.StopIteration`,
 *  or an error occurs.
 * This method can be called like JavaScript `while (true) { ... }` statement.
 *
 * @param {Function} callback The function that is executed for each iteration
 * @param {Object} [context] Value to use as `this` when executing callback
 * @return {Promise} Return new Promise
 */
export function until(callback, context) {
  return iterate(iterator.until(callback, context));
}

// Minimum setTimeout interval for waitUntil
const WAIT_UNTIL_INTERVAL = 13;

/**
 * Executes a provided function until the `callback` returns `chillout.StopIteration`,
 *  or an error occurs.
 * This method can be called like JavaScript `while (true) { ... }` statement,
 *  and it works same as `until`, but it executes tasks with more slowly interval
 *  than `until` to reduce CPU load.
 * This method is useful when you want to wait until some processing done.
 *
 * @param {Function} callback The function that is executed for each iteration
 * @param {Object} [context] Value to use as `this` when executing callback
 * @return {Promise} Return new Promise
 */
export function waitUntil(callback, context) {
  return iterate(iterator.until(callback, context), WAIT_UNTIL_INTERVAL);
}

/**
 * Iterates the iterable objects, similar to the `for-of` statement.
 * Executes a provided function once per element.
 * The iteration will break if the callback function returns `chillout.StopIteration`,
 *   or an error occurs.
 *
 * @param {Array|string|Object} iterable Target iterable objects
 * @param {Function} callback Function to execute for each element, taking one argument:
 * - value: A value of a property on each iteration
 * @param {Object} [context] Value to use as `this` when executing callback
 * @return {Promise} Return new Promise
 */
export function forOf(iterable, callback, context) {
  return iterate(iterator.forOf(iterable, callback, context));
}

export {
  /**
   * If you want to stop the loops, return this StopIteration
   * It works like 'break' statement in JavaScript 'for' statement
   */
  StopIteration,

  // Exports core methods for user defining other iterations by using chillout
  iterate, iterator, isThenable, isArrayLike, nextTick
};
