# vamas

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![DOI](https://www.zenodo.org/badge/271784092.svg)](https://www.zenodo.org/badge/latestdoi/271784092)

Vamas file format parser, following the [ISO specification](https://www.iso.org/standard/24269.html).

## Installation

`$ npm i vamas`

One VAMAS file contains

- many blocks
  - survey (or wide)
  - multiplex (for example C, Ru, ...)
  - identified by `blockID`

In a block:

- regions (used for baseline)
- identified by `regionID`

In a block and expected to be in a specific region:

- components: corresponds to the shape of the peak and relies on the baseline
- identified by `componentID`

## Usage

```js
import { parse } from 'vamas';

const result = parse(vamasText);
```

## [API Documentation](https://cheminfo.github.io/vamas/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/vamas.svg
[npm-url]: https://www.npmjs.com/package/vamas
[ci-image]: https://github.com/cheminfo/vamas/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/vamas/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/vamas.svg
[codecov-url]: https://codecov.io/gh/cheminfo/vamas
[download-image]: https://img.shields.io/npm/dm/vamas.svg
[download-url]: https://www.npmjs.com/package/vamas
