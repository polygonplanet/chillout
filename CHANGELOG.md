# Changelog

All notable changes to this project will be documented in this file.

## [5.0.0]
### Changed
- Changed delay time to run more slowly to reduce CPU than previously.

### Removed
- Drop bower support.

## [4.0.4] - 2019-11-02
### Fixed
- Bump dev dependencies.

## [4.0.3] - 2019-08-18
### Fixed
- Fixed invalid uglifyjs option.

## [4.0.2] - 2019-03-18
### Fixed
- Fixed tests timeout.

## [4.0.0] - 2019-03-03
### Added
- Added `waitUntil` method.
- Added core methods and properties to exports.

### Changed
- Changed `till` method name to `until`
- Changed the key name to `done` instead of `end` in `repeat` method with arguments passed as object.
- Changed use `return chillout.StopIteration` to stop the loop instead of `return false`.

### Fixed
- Fixed parameters can be passed when called with nested Promise.

## [3.1.9] - 2018-12-10
### Fixed
- Fixed `can't find module` using "require".

## [3.1.8] - 2018-12-10
### Fixed
- Fixed result when using `async/await`.

### Changed
- Change internal iteration stopper.

## [3.1.7] - 2018-05-10
### Fixed
- Fixed bug for `can't find module`.

## [3.1.6] - 2018-02-17
### Fixed
- Fixed build commands.

## [3.1.4] - 2017-07-15
### Changed
- Change eslint base to `eslint:recommended`.

## [3.1.3] - 2017-01-20
### Fixed
- Improve return statement in iterator function. Thanks to [@JuhQ](https://github.com/JuhQ).

## [3.1.0] - 2016-06-06
### Added
- Add forOf iterator.

## [3.0.0] - 2016-04-30
### Changed
- Change API method names.

## [2.0.0] - 2016-03-12
### Changed
- Modularize the code base

## [1.1.5] - 2016-02-12
### Fixed
- Fix chillout.each to work with generic array-like object instead of an array.

## [1.1.0] - 2016-01-15
### Fixed
- Fix setImmediate by MessageChannel.

## [1.0.0] - 2016-01-05
### Added
- First release.

[5.0.0]: https://github.com/polygonplanet/chillout/compare/4.0.3...5.0.0
[4.0.4]: https://github.com/polygonplanet/chillout/compare/4.0.3...4.0.4
[4.0.3]: https://github.com/polygonplanet/chillout/compare/4.0.2...4.0.3
[4.0.2]: https://github.com/polygonplanet/chillout/compare/4.0.0...4.0.2
[4.0.0]: https://github.com/polygonplanet/chillout/compare/3.1.9...4.0.0
[3.1.9]: https://github.com/polygonplanet/chillout/compare/3.1.8...3.1.9
[3.1.8]: https://github.com/polygonplanet/chillout/compare/3.1.7...3.1.8
[3.1.7]: https://github.com/polygonplanet/chillout/compare/3.1.6...3.1.7
[3.1.6]: https://github.com/polygonplanet/chillout/compare/3.1.4...3.1.6
[3.1.4]: https://github.com/polygonplanet/chillout/compare/3.1.3...3.1.4
[3.1.3]: https://github.com/polygonplanet/chillout/compare/3.1.0...3.1.3
[3.1.0]: https://github.com/polygonplanet/chillout/compare/3.0.0...3.1.0
[3.0.0]: https://github.com/polygonplanet/chillout/compare/2.0.0...3.0.0
[2.0.0]: https://github.com/polygonplanet/chillout/compare/1.1.5...2.0.0
[1.1.5]: https://github.com/polygonplanet/chillout/compare/1.1.0...1.1.5
[1.1.0]: https://github.com/polygonplanet/chillout/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/polygonplanet/chillout/releases/tag/1.0.0
