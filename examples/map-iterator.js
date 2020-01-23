// Example for defining "map", extend chillout.js iterations
// Reference: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map

function mapIterator(array, callback, context) {
  var len = array.length;
  var i = 0;
  var items = [];

  return {
    next() {
      var isStop = false;
      if (i >= len) {
        isStop = true;
        return [isStop, items];
      }
      items[i] = callback.call(context, array[i], i, array);
      i++;
      return [isStop, items];
    }
  };
};

chillout.map = function(/* array, callback, context */) {
  return chillout.iterate(mapIterator.apply(this, arguments));
};


// example
chillout.map([0, 1, 2, 3], function(num) {
  return num * 10;
}).then(function(items) {
  console.log(items); // [0, 10, 20, 30]
});


chillout.map(['1', '2', '3', '4', '5'], Number).then(function(items) {
  console.log(items); // [1, 2, 3, 4, 5]
});


var users = [
  { id: 1, name: 'foo' },
  { id: 2, name: 'bar' },
  { id: 3, name: 'baz' }
];

chillout.map(users, user => user.name).then(function(names) {
  console.log(names); // ['foo', 'bar', 'baz']
});
