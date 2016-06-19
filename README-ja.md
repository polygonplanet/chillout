chillout.js
===========

非同期反復によりJavaScriptのCPU使用率を抑えます。

[![Build Status](https://travis-ci.org/polygonplanet/chillout.svg?branch=master)](https://travis-ci.org/polygonplanet/chillout)

低CPU使用率で実行できる**Promiseベース**の非同期反復APIを提供します。  
各ループはCPUの安定性を維持するために、処理が重い場合は適度なディレイが付加され、  
逆に処理が軽い場合はディレイなしで繰り返し、処理速度を低下させずに実行します。  
それにより、CPUに優しい処理を実現します。  
また、「警告: 応答のないスクリプト」などのブラウザ警告なしでJavaScriptを実行できます。

ブラウザ上、Electron、Node.js などの環境で利用できます。

## 導入

**chillout** というモジュール名で `npm` から利用できます。

```bash
$ npm install chillout --save
```

また、`Bower` からも利用できます。

```bash
$ bower install chillout
```

以下のようにして実行できます。

```javascript
var chillout = require('chillout');
chillout.forEach(...)
```

ブラウザ上で実行されている場合、**chillout** というオブジェクトがグローバルに定義されます。

## 互換性

`Promise` が動く環境が必要です。  
`Promise` がサポートされてない環境の場合は、[es6-shim](https://github.com/paulmillr/es6-shim) や、他の `Promise` polyfill を使ってください。


## ベンチマーク

forループと `chillout.repeat` を比較します。

```javascript
function heavyProcess() {
  var v;
  for (var i = 0; i < 5000; i++) {
    for (var j = 0; j < 5000; j++) {
      v = i * j;
    }
  }
  return v;
}
```

### forループ

```javascript
var time = Date.now();
for (var i = 0; i < 1000; i++) {
  heavyProcess();
}
var processingTime = Date.now() - time;
console.log(processingTime);
```

![CPU usage without chillout](https://raw.github.com/wiki/polygonplanet/chillout/images/benchmark-cpu-usage-without-chillout.png)

* 処理時間: 107510ms.
* CPU平均使用率(Nodeプロセス): **97.13%**

### chillout.repeat


```javascript
var time = Date.now();
chillout.repeat(1000, function(i) {
  heavyProcess();
}).then(function() {
  var processingTime = Date.now() - time;
  console.log(processingTime);
});
```

![CPU usage with chillout](https://raw.github.com/wiki/polygonplanet/chillout/images/benchmark-cpu-usage-using-chillout.png)

* 処理時間: 138432ms.
* CPU平均使用率(Nodeプロセス): **73.88%**

### ベンチマーク結果

![CPU usage with chillout](https://raw.github.com/wiki/polygonplanet/chillout/images/benchmark-cpu-usage-compare.png)

| &nbsp;                          | ForStatement (for文) | chillout.repeat |
| ------------------------------- | --------------------:| ---------------:|
| 処理時間                         |            107510ms. |       138432ms. |
| CPU平均使用率(Nodeプロセス)         |           **97.13%** |      **73.88%** |


`chillout.repeat` は forループ よりも低いCPU使用率で実行されているのが確認できます。  
chillout.js は、より低いCPU使用率と自然な速さでJavaScriptを実行できますが、処理速度は少し遅くなります。  
特にブラウザ上で実行されるJavaScriptのパフォーマンスにおいて最も重要なことの一つは、  
数値的な速度ではなく、安定したレスポンスによってユーザーにストレスを与えずに実行することと考えています。

*(ベンチマーク: Windows8.1 / Intel(R) Atom(TM) CPU Z3740 1.33GHz)*

### ベンチマークを実行

`npm run benchmark` でベンチマークを実行できます。

----

## API

### forEach

与えられた関数を、配列またはオブジェクトの各要素に対して一度ずつ実行します。  
関数内で `false` を返すか、エラーが発生すると、それ以降の反復は実行されません。

* chillout.**forEach** ( obj, callback [, context ] )  
  @param {_Array|Object_} _obj_ 対象の配列またはオブジェクト。  
  @param {_Function_} *callback* 各要素に対して実行するコールバック関数で、３つの引数をとります。  
  - value: 現在処理されている配列の要素、またはオブジェクトの値。
  - key: 現在処理されている配列の要素のインデックス、またはオブジェクトのキー。
  - obj: `forEach` が適用されている配列またはオブジェクト。

  @param {_Object_} [_context_] 任意。コールバック内で `this` として使用する値。  
  @return {_Promise_} Promiseオブジェクトを返します。

配列の反復例:
```javascript
var sum = 0;
chillout.forEach([1, 2, 3], function(value, i) {
  sum += value;
}).then(function() {
  console.log(sum); // 6
});
```

オブジェクトの反復例:
```javascript
var result = '';
chillout.forEach({ a: 1, b: 2, c: 3 }, function(value, key) {
  result += key + value;
}).then(function() {
  console.log(result); // 'a1b2c3'
});
```

### repeat

与えられた関数を、引数で与えられた数だけ実行します。  
関数内で `false` を返すか、エラーが発生すると、それ以降の反復は実行されません。

* chillout.**repeat** ( count, callback [, context ] )  
  @param {_number|Object_} _count_ 繰り返す回数またはオブジェクトで指定。  
  オブジェクトで指定する場合は以下のキーが有効です。
  - start: 開始する数。
  - step: ステップ数。
  - end: 終了する数。

  @param {_Function_} _callback_ 各反復に対して実行するコールバック関数で、1つの引数をとります。
  - i: 現在の数。

  @param {_Object_} [_context_] 任意。コールバック内で `this` として使用する値。  
  @return {_Promise_} Promiseオブジェクトを返します。

回数を指定する例:

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

オブジェクトで指定する例:

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

与えられた関数を、 `false` が返されるかエラーが発生するまで繰り返します。

* chillout.**till** ( callback [, context ] )  
  @param {_Function_} _callback_ 各反復に対して実行するコールバック関数。  
  @param {_Object_} [_context_] 任意。コールバック内で `this` として使用する値。  
  @return {_Promise_} Promiseオブジェクトを返します。

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

列挙可能なプロパティに対して、反復処理を行います。
これは `for-of` ステートメントと同じ反復処理をします。

与えられた関数を各反復に対して実行します。
関数内で `false` を返すか、エラーが発生すると、それ以降の反復は実行されません。

* chillout.**forOf** ( iterable, callback [, context ] )  
  @param {_Array|string|Object_} _iterable_ 列挙可能なプロパティに対して、反復処理を行うオブジェクト。  
  @param {_Function_} _callback_ 各反復に対して実行するコールバック関数で、1つの引数をとります。
  - value: 各反復処理におけるプロパティの値。

  @param {_Object_} [_context_] 任意。コールバック内で `this` として使用する値。  
  @return {_Promise_} Promiseオブジェクトを返します。

配列の反復例:

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

文字列の反復例:

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

## 比較表

既存のJavaScriptループを chillout.js のAPIに置き換えることで、CPU使用率を抑えることができます。

変換例:

| JavaScript Statement                 | chillout                                                                      |
| -------------------------------------|-------------------------------------------------------------------------------|
| [1, 2, 3].forEach(function(v, i) {}) | chillout.forEach([1, 2, 3], function(v, i) {})                                |
| for (i = 0; i < 5; i++) {}           | chillout.repeat(5, function(i) {})                                            |
| for (i = 10; i < 20; i += 2) {}      | chillout.repeat({ start: 10, step: 2, end: 20 }, function(i) {})              |
| while (true) {}                      | chillout.till(function() {})                                                  |
| while (cond()) {}                    | chillout.till(function() {<br>&nbsp;&nbsp;if (!cond()) return false;<br>})    |
| for (value of [1, 2, 3]) {}          | chillout.forOf([1, 2, 3], function(value) {})                                 |

## 貢献

pull request または issues を歓迎します。  
pull request の際は、 `npm test` を実行してエラーがないことを確認してください。

## ライセンス

MIT
