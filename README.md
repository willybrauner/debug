# debug

> This repo is a fork of [@wbe/debug](https://github.com/willybrauner/debug)

Tiny debug tool (~500 bytes) for terminal and browser inspired by [visionmedia/debug](https://github.com/visionmedia/debug) API.

![](https://img.shields.io/npm/v/@cher-ami/debug/latest.svg)
![](https://github.com/willybrauner/debug/workflows/CI/badge.svg)
![](https://img.shields.io/bundlephobia/minzip/@cher-ami/debug.svg)
![](https://img.shields.io/npm/dt/@cher-ami/debug.svg)
![](https://img.shields.io/npm/l/@cher-ami/debug.svg)

![](screen.jpg)

## Motivation 

`@cher-ami/debug` was built in order to be as light as possible for terminal and browser, 
as the same way as the great visionmedia/debug tool.

## Installation

```shell script
$ npm i @cher-ami/debug
```

## debug node

```shell
DEBUG=* node file.js  
```
```js
const debug = require("@cher-ami/debug")
debug('foo'); // "foo"
```

`process.env.DEBUG` value can be defined as a specific namespace too:

```shell
DEBUG=namespace node file.js  
```

Only debug function declaration with `namespace` declared as namespace will be printed in the console:

```js
// add the namspace as returned function paramater
const debug = require("@cher-ami/debug")("namespace")
debug('foo'); // "namespace foo"
```

`process.env.DEBUG` value accept "one glob parameter level":

```shell
DEBUG=config:* node file.js
```
Every debug function declaration with namespace `config:{somestring}` will be logged.

## debug in browser

In the same way as nodejs usage, `debug` is browser compatible with the same API. The only difference is 
we need to set the current namespace in localStorage.

Add on your browser localStorage: 

```shell
localStorage.debug = "foo"
```

Use debug in javascript:

```js
// es6 import
import debug from "@cher-ami/debug"
const log = debug('foo');
log("bar") // "foo bar"

// commonjs import
const debug = require("@cher-ami/debug")("foo")
debug('bar'); // "foo bar"
```
## Examples

Install dependencies:
```shell
pnpm i
```

Start example:
```shell
# browser example
npm run dev:example-browser
# node example
npm run dev:example-dev
```

## Credits

[Willy Brauner](https://willybrauner.com)

## Licence

MIT



