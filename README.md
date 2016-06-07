chillout.js
===========

[**README (日本語)**](README-ja.md)

Reduce JavaScript CPU usage by asynchronous iteration.

[![Build Status](https://travis-ci.org/polygonplanet/chillout.svg?branch=master)](https://travis-ci.org/polygonplanet/chillout)

Provides asynchronous iteration functions that have a **Promise based** interface and it can execute with low CPU usage.
Each iteration adds delay if the processing is heavy to maintain the CPU stability.
Iterate without delay if processing is fast.
Therefore, it will realize friendly processing for your machine.
It can execute JavaScript without "Warning: Unresponsive Script" alert in the browser.

You can use it in any JavaScript environment (Browser, Electron, Node.js).

## Installation

Available on `npm` as **chillout**.

```bash
$ npm install chillout --save
```

This can also be installed with `Bower`.

```bash
$ bower install chillout
```

```javascript
var chillout = require('chillout');
chillout.forEach(...)
```

Object **chillout** will be defined in the global scope if running in the browser window.


## Compatibility

The limiting factor for browser/node support is the use of `Promise`.  
You can use [es6-shim](https://github.com/paulmillr/es6-shim) or other `Promise` polyfills.

## Benchmarks

Benchmarks the **ForStatement** and `chillout.repeat`.

```javascript
function heavyProcess() {
  for (var i = 0; i < 10000; i++) {
    for (var j = 0; j < 10000; j++) {
      var v = i*j;
    }
  }
}
```

### ForStatement

```javascript
var time = Date.now();
for (var i = 0; i < 500; i++) {
  heavyProcess();
}
var processingTime = Date.now() - time;
console.log(processingTime);
```

![CPU usage without chillout](https://raw.github.com/wiki/polygonplanet/chillout/images/cpu-usage-without-chillout.png)

* Processing time: 51049ms.
* CPU total average: **31.10%**

### chillout.repeat


```javascript
var time = Date.now();
chillout.repeat(500, function(i) {
  heavyProcess();
}).then(function() {
  var processingTime = Date.now() - time;
  console.log(processingTime);
});
```

![CPU usage with chillout](https://raw.github.com/wiki/polygonplanet/chillout/images/cpu-usage-with-chillout.png)

* Processing time: 59769ms.
* CPU total average: **22.76%**


### Benchmark Result

![CPU usage with chillout](https://raw.github.com/wiki/polygonplanet/chillout/images/cpu-usage-compare-arrow.png)

| &nbsp;               | ForStatement | chillout.repeat |
| -------------------- | ------------:| ---------------:|
| Processing time      |     51049ms. |        59769ms. |
| CPU total average    |   **31.10%** |      **22.76%** |


You can confirm that `chillout.repeat` is running on a more low CPU usage than **ForStatement**.

chillout.js can run JavaScript in a natural speed with low CPU usage, but processing speed will be a bit slow.

One of the most important thing of performance in JavaScript, that is not numeric speed, but is to execute without causing stress to the user experience.


*(Benchmarks: Windows8.1 / Intel(R) Atom(TM) CPU Z3740 1.33GHz)*

### Run Benchmark

You can test benchmark with `npm run benchmark`.

----

## Iteration Functions

### forEach

Executes a provided function once per array or object element.  
The iteration will break if the callback function returns `false`, or an error occurs.

* chillout.**forEach** ( obj, callback [, context ] )  
  @param {_Array|Object_} _obj_ Target array or object.  
  @param {_Function_} *callback* Function to execute for each element, taking three arguments:  
  - value: The current element being processed in the array/object.
  - key: The key of the current element being processed in the array/object.
  - obj: The array/object that `forEach` is being applied to.

  @param {_Object_} [_context_] Value to use as `this` when executing callback.  
  @return {_Promise_} Return new Promise.

Example of array iteration:
```javascript
var sum = 0;
chillout.forEach([1, 2, 3], function(value, i) {
  sum += value;
}).then(function() {
  console.log(sum); // 6
});
```

Example of object iteration:
```javascript
var result = '';
chillout.forEach({ a: 1, b: 2, c: 3 }, function(value, key) {
  result += key + value;
}).then(function() {
  console.log(result); // 'a1b2c3'
});
```

### repeat

Executes a provided function the specified number times.  
The iteration will break if the callback function returns `false`, or an error occurs.

* chillout.**repeat** ( count, callback [, context ] )  
  @param {_number|Object_} _count_ The number of times or object for execute the function.  
  Following parameters are available if specify object:
  - start: The number of start.
  - step: The number of step.
  - end: The number of end.

  @param {_Function_} _callback_ Function to execute for each times, taking one argument:
  - i: The current number.

  @param {_Object_} [_context_] Value to use as `this` when executing callback.  
  @return {_Promise_} Return new Promise.

Example of specify number:

```javascript
chillout.repeat(5, function(i) {
  console.log(i);
}).then(function() {
  console.log('end');
});
// 0
// 1
// 2
// 3
// 4
// end
```

Example of specify object:

```javascript
chillout.repeat({ start: 10, step: 2, end: 20 }, function(i) {
  console.log(i);
}).then(function() {
  console.log('end');
});
// 10
// 12
// 14
// 16
// 18
// end
```

### till

Executes a provided function until the `callback` returns `false`, or an error occurs.

* chillout.**till** ( callback [, context ] )  
  @param {_Function_} _callback_ The function that is executed for each iteration.  
  @param {_Object_} [_context_] Value to use as `this` when executing callback.  
  @return {_Promise_} Return new Promise.

```javascript
var i = 0;
chillout.till(function() {
  console.log(i);
  i++;
  if (i === 5) {
    return false; // stop iteration
  }
}).then(function() {
  console.log('end');
});
// 0
// 1
// 2
// 3
// 4
// end
```

### forOf

Iterates the iterable objects, similar to the `for-of` statement.  
Executes a provided function once per element.  
The iteration will break if the callback function returns `false`, or an error occurs.

* chillout.**forOf** ( iterable, callback [, context ] )  
  @param {_Array|string|Object_} _iterable_ Target iterable objects.  
  @param {_Function_} _callback_ Function to execute for each element, taking one argument:
  - value: A value of a property on each iteration.

  @param {_Object_} [_context_] Value to use as `this` when executing callback.  
  @return {_Promise_} Return new Promise.

Example of iterate array:

```javascript
chillout.forOf([1, 2, 3], function(value) {
  console.log(value);
}).then(function() {
  console.log('end');
});
// 1
// 2
// 3
// end
```

Example of iterate string:

```javascript
chillout.forOf('abc', function(value) {
  console.log(value);
}).then(function() {
  console.log('end');
});
// a
// b
// c
// end
```

## Comparison Table

You can reduce the CPU load by changing your JavaScript iteration to the chillout iteration.


Examples:

| JavaScript Statement                 | chillout                                                                      |
| -------------------------------------|-------------------------------------------------------------------------------|
| [1, 2, 3].forEach(function(v, i) {}) | chillout.forEach([1, 2, 3], function(v, i) {})                                |
| for (i = 0; i < 5; i++) {}           | chillout.repeat(5, function(i) {})                                            |
| for (i = 10; i < 20; i += 2) {}      | chillout.repeat({ start: 10, step: 2, end: 20 }, function(i) {})              |
| while (true) {}                      | chillout.till(function() {})                                                  |
| while (cond()) {}                    | chillout.till(function() {<br>&nbsp;&nbsp;if (!cond()) return false;<br>})    |
| for (value of [1, 2, 3]) {}          | chillout.forOf([1, 2, 3], function(value) {})                                 |

## Contributing

I'm waiting for your pull requests and issues.
Don't forget to execute `npm test` before requesting.
Accepted only requests without errors.


## License

MIT
