const iterator = require('./iterator');
const iterate = require('./iterate');
const { isThenable, isArrayLike } = require('./util');
const nextTick = require('./next-tick');
const StopIteration = require('./stop-iteration');

exports.version = require('../package.json').version;

/**
 * Executes a provided function once per array or object element.
 * The iteration will break if the callback function returns `chillout.StopIteration`,
 *  or an error occurs.
 * This method can be called like JavaScript `Array forEach`.
 *
 * @param {array|object} obj Target array or object
 * @param {function} callback Function to execute for each element, taking three arguments:
 * - value: The current element being processed in the array/object
 * - key: The key of the current element being processed in the array/object
 * - obj: The array/object that `forEach` is being applied to
 * @param {object} [context] Value to use as `this` when executing callback
 * @return {promise} Return new Promise
 */
exports.forEach = function forEach(obj, callback, context) {
  return iterate(iterator.forEach(obj, callback, context));
};

/**
 * Executes a provided function the specified number times.
 * The iteration will break if the callback function returns `chillout.StopIteration`,
 *  or an error occurs.
 * This method can be called like JavaScript `for` statement.
 *
 * @param {number|object} count The number of times or object for execute the
 *   function. Following parameters are available if specify object:
 * - start: The number of start
 * - step: The number of step
 * - end: The number of end
 * @param {function} callback Function to execute for each times, taking one argument:
 * - i: The current number
 * @param {object} [context] Value to use as `this` when executing callback
 * @return {promise} Return new Promise
 */
exports.repeat = function repeat(count, callback, context) {
  return iterate(iterator.repeat(count, callback, context));
};

/**
 * Executes a provided function until the `callback` returns `chillout.StopIteration`,
 *  or an error occurs.
 * This method can be called like JavaScript `while (true) { ... }` statement.
 *
 * @param {function} callback The function that is executed for each iteration
 * @param {object} [context] Value to use as `this` when executing callback
 * @return {promise} Return new Promise
 */
exports.until = function until(callback, context) {
  return iterate(iterator.until(callback, context));
};

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
 * @param {function} callback The function that is executed for each iteration
 * @param {object} [context] Value to use as `this` when executing callback
 * @return {promise} Return new Promise
 */
exports.waitUntil = function waitUntil(callback, context) {
  return iterate(iterator.until(callback, context), WAIT_UNTIL_INTERVAL);
};

/**
 * Iterates the iterable objects, similar to the `for-of` statement.
 * Executes a provided function once per element.
 * The iteration will break if the callback function returns `chillout.StopIteration`,
 *   or an error occurs.
 *
 * @param {array|string|object} iterable Target iterable objects
 * @param {function} callback Function to execute for each element, taking one argument:
 * - value: A value of a property on each iteration
 * @param {object} [context] Value to use as `this` when executing callback
 * @return {promise} Return new Promise
 */
exports.forOf = function forOf(iterable, callback, context) {
  return iterate(iterator.forOf(iterable, callback, context));
};

// If you want to stop the loops, return this StopIteration
// it works like 'break' statement in JavaScript 'for' statement
exports.StopIteration = StopIteration;

// Exports core methods for user defining other iterations by using chillout
exports.iterate = iterate;
exports.iterator = iterator;
exports.isThenable = isThenable;
exports.isArrayLike = isArrayLike;
exports.nextTick = nextTick;
