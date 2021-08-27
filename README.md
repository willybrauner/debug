# @wbe/debug

Tiny debug tool (~500 bytes) for terminal and browser inspired by [visionmedia/debug](https://github.com/visionmedia/debug) API.

![](https://img.shields.io/npm/v/@wbe/debug/latest.svg)
![](https://img.shields.io/bundlephobia/minzip/@wbe/debug.svg)
![](https://img.shields.io/npm/dt/@wbe/debug.svg)
![](https://img.shields.io/npm/l/@wbe/debug.svg)

![](screen.jpg)

## Installation

```shell script
$ npm install -s @wbe/debug
```

## debug node

```shell
DEBUG=true node file.js  
```
```js
const debug = require("@wbe/debug")
debug('foo'); // foo"
```

`process.env.DEBUG` value can be defined as a specific namespace too:

```shell
DEBUG=config:my-task node file.js  
```

Only debug function declaration with `config:my-task` declared as namespace will be printed in the console:

```js
// add the namspace as returned function paramater
const debug = require("@wbe/debug")("config:task")
debug('foo'); // config:task foo"
```

`process.env.DEBUG` value accept one glob parameter level: 

```shell
DEBUG=config:* node file.js  
```
Every debug function declaration with `config:{somestring}` declared as namespace will be printed.


## debug in browser

In the same way of nodejs usage, `debug` is browser compatible with the same API. The only difference is 
we need to set the current namespace in localStorage.  

Add on your browser localStorage: 

```shell
localStorage.debug = "foo"
```

Use debug on js script:

```js

const debug = require("@wbe/debug")("foo")
debug('bar'); // foo bar"

// or with es6 import
import debug from "@wbe/debug"
const log = debug('foo');

debug("bar") // foo bar"

```
## Example

Test browser example:
`````shell
npm i && npm run dev:browser
`````

Test node example:
`````shell
npm i && npm run dev:node
`````

## Credits

Willy Brauner

## Licence

MIT



