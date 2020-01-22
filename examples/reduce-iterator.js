// Example for defining "reduce", extend chillout.js iterations
// Reference: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

chillout.iterator.reduce = function(array, callback /*, initialValue, context */) {
  var len = array.length;
  var i = 0;
  var value, context;

  if (arguments.length >= 3) {
    value = arguments[2];
    context = arguments[3];
  } else {
    value = array[0];
    context = null;
    i++;
  }

  return {
    next() {
      var isStop = false;
      if (i >= len) {
        isStop = true;
        return [isStop, value];
      }
      value = callback.call(context, value, array[i], i, array);
      i++;
      return [isStop, value];
    }
  };
};

chillout.reduce = function(/* array, callback, initialValue, context */) {
  return chillout.iterate(chillout.iterator.reduce.apply(this, arguments));
};


// example
chillout.reduce([0, 1, 2, 3], function(accumulator, currentValue) {
  return accumulator + currentValue;
}, 0).then(function(sum) {
  console.log(sum); // 6
});


chillout.reduce([1, 2, 3, 4], function(accumulator, currentValue) {
  return accumulator + currentValue;
}).then(function(sum) {
  console.log(sum); // 10
});


chillout.reduce([[0, 1], [2, 3], [4, 5]], function(accumulator, currentValue) {
  return accumulator.concat(currentValue);
}, []).then(function(flattened) {
  console.log(flattened); // [0, 1, 2, 3, 4, 5]
});
