chillout.js
===========

CPU負荷を抑えて重い処理を軽くします。


[![Build Status](https://travis-ci.org/polygonplanet/chillout.svg?branch=master)](https://travis-ci.org/polygonplanet/chillout)


## 概要

chillout.js は「処理時間を短くする」という物理的な高速化とは違い、CPU負荷を抑えてリソースに余裕を持たせ、重い処理でも軽く感じさせることでユーザーにとって体感的・心理的な高速化につなげる JavaScript ライブラリです。

### 重い処理から開放されるために

重いWebページやゲームでは画面が読み込み中のままカクカクだったり、Webページに限らずnode.jsでバッチ処理するときでも高CPU負荷が続くとマシンごと重くなってしまいます。  

特にスペックの低い端末では、CPU使用率100%の状態が続くと加熱されて冷却ファンが激しく回り、そのまま使い続けると冷却が追いつかずに熱暴走してしまう可能性もあります。

### JavaScriptでCPU負荷を抑えるには？

重い処理のほとんどはループ処理によって発生します。ループの中でさらにループ、その中でさらにループ…。単純に考えた場合、そうならないようループの途中で一定時間処理を休止させればいいんですが、それができません。 
JavaScript には一定の時間休む sleep のような機能がないからです。そこで、sleepするにはどうするか？というと「非同期」でループ処理します。 

JavaScript では、`setTimeout` や `process.nextTick` を使って同期処理を非同期化できます。
それと `Promise` を組み合わせると sleep のように一定時間CPUを休ませる非同期処理が実現できます。

### 処理時間を短くするんじゃなく、体感速度を向上させる体感的・心理的な高速化

処理の高速化というと、とにかく1ミリ秒でも処理時間を短くすることが手法とされますが、Webページやアプリ、ゲームといった、人が画面を見たり操作する場合 心理的に「速い」と感じればユーザーのストレスが減り結果として高速化につながります。  

chillout.js は、ループ処理が重いときにはCPUが休まるくらいの休止時間、処理が速いときには休止時間なしか、わずかな休止時間をいれ本来のループを邪魔しないようにし、結果としてカクカクするような重さを感じさせずにループを実行します。  

また、処理が重くなるとでる 「警告: 応答のないスクリプト」 といったブラウザ警告なしでJavaScriptを実行できます。  


ブラウザ上、Electron、Node.js などの環境で使えます。


## インストール

**chillout** というモジュール名で `npm` から利用できます。

```bash
$ npm install chillout --save
```

`Bower` からインストールする場合:

```bash
$ bower install chillout
```

以下のように使えます。

```javascript
var chillout = require('chillout');
chillout.forEach(...)
```

ブラウザで実行してる場合は、**chillout** というオブジェクトがグローバル ( `window.chillout` ) に定義されます。

## 動作環境

`Promise` が動けば使えます(最新のブラウザはどれも動きます)。


(古い環境で `Promise` がサポートされてない環境の場合は、[es6-shim](https://github.com/paulmillr/es6-shim) や、他の `Promise` polyfill を使ってください。)

## async / await

`async/await` が使える環境ならより簡潔に書けます。 chillout.js のAPIはすべて Promise を返すため `async/await` で表現しやすくなっています。


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
関数内で `false` を返すか、エラーが発生すると、それ以降のループ処理は実行されません。

* chillout.**forEach** ( obj, callback [, context ] )  
  @param {_Array|Object_} _obj_ 対象の配列またはオブジェクト。  
  @param {_Function_} *callback* 各要素に対して実行するコールバック関数で、3つの引数をとります。  
  - value: 現在処理されている配列の要素、またはオブジェクトの値。
  - key: 現在処理されている配列の要素のインデックス、またはオブジェクトのキー。
  - obj: `forEach` が適用されている配列またはオブジェクト。

  @param {_Object_} [_context_] 任意。コールバック内で `this` として使用する値。  
  @return {_Promise_} Promiseオブジェクトを返します。

配列のループ例:

```javascript
var values = ['a', 'b', 'c'];

chillout.forEach(values, function(value, key, obj) {
  console.log(value);
}).then(function() {
  console.log('done');
});

// 'a'
// 'b'
// 'c'
// 'done'
```

オブジェクトのループ例:

```javascript
var values = {
  a: 1,
  b: 2,
  c: 3
};

chillout.forEach(values, function(value, key, obj) {
  console.log(key + ':' + value);
}).then(function() {
  console.log('done');
});

// 'a:1'
// 'b:2'
// 'c:3'
// 'done'
```

### repeat

与えられた関数を、引数で与えられた数だけ実行します。  
関数内で `false` を返すか、エラーが発生すると、それ以降のループ処理は実行されません。

* chillout.**repeat** ( count, callback [, context ] )  
  @param {_number|Object_} _count_ 繰り返す回数またはオブジェクトで指定。  
  オブジェクトで指定する場合は以下のキーが有効です。
  - start: 開始する数。
  - step: ステップ数。
  - end: 終了する数。

  @param {_Function_} _callback_ 各ループに対して実行するコールバック関数で、1つの引数をとります。
  - i: 現在の数。

  @param {_Object_} [_context_] 任意。コールバック内で `this` として使用する値。  
  @return {_Promise_} Promiseオブジェクトを返します。

回数を指定する例:

```javascript
chillout.repeat(5, function(i) {
  console.log(i);
}).then(function() {
  console.log('done');
});

// 0
// 1
// 2
// 3
// 4
// 'done'
```

オブジェクトで指定する例:

```javascript
chillout.repeat({ start: 10, step: 2, end: 20 }, function(i) {
  console.log(i);
}).then(function() {
  console.log('done');
});

// 10
// 12
// 14
// 16
// 18
// 'done'
```

### till

与えられた関数を、 `false` が返されるかエラーが発生するまで繰り返します。

* chillout.**till** ( callback [, context ] )  
  @param {_Function_} _callback_ 各ループに対して実行するコールバック関数。  
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
  console.log('done');
});

// 0
// 1
// 2
// 3
// 4
// 'done'
```

### forOf

列挙可能なプロパティに対して、ループ処理を行います。
これは `for-of` ステートメントと同じループ処理をします。

与えられた関数を各ループに対して実行します。
関数内で `false` を返すか、エラーが発生すると、それ以降のループは実行されません。

* chillout.**forOf** ( iterable, callback [, context ] )  
  @param {_Array|string|Object_} _iterable_ 列挙可能なプロパティに対して、ループ処理を行うオブジェクト。  
  @param {_Function_} _callback_ 各ループに対して実行するコールバック関数で、1つの引数をとります。
  - value: 各ループ処理におけるプロパティの値。

  @param {_Object_} [_context_] 任意。コールバック内で `this` として使用する値。  
  @return {_Promise_} Promiseオブジェクトを返します。

配列のループ例:

```javascript
chillout.forOf([1, 2, 3], function(value) {
  console.log(value);
}).then(function() {
  console.log('done');
});

// 1
// 2
// 3
// 'done'
```

文字列のループ例:

```javascript
chillout.forOf('abc', function(value) {
  console.log(value);
}).then(function() {
  console.log('done');
});

// 'a'
// 'b'
// 'c'
// 'done'
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


※ `async/await` が使える環境ではより簡潔に書けます。 chillout.js のAPIはすべて Promise を返すため `async/await` で扱いやすくなっているためです。


## 貢献

pull request または issues を歓迎します。  
pull request の際は、 `npm test` を実行してエラーがないことを確認してください。

## ライセンス

MIT
