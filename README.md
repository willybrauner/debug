# @wbe/debug

Tiny debug tool for terminal and browsers inspired by [visionmedia/debug](https://github.com/visionmedia/debug) API.

![](https://img.shields.io/npm/v/@wbe/debug/latest.svg)
![](https://img.shields.io/bundlephobia/minzip/@wbe/debug.svg)
![](https://img.shields.io/npm/dt/@wbe/debug.svg)
![](https://img.shields.io/npm/l/@wbe/debug.svg)

## Installation

```shell script
$ npm install -s @wbe/debug
```

## debug in brower

Add on your browser console: 

```shell
localStorage.debug = true
```

Use debug on script

```js
import debug from "@wbe/debug"
debug('foo'); // "currentFileName.js  foo"
```

## debug node

```shell
DEBUG=true node file.js  
```
```js
const debug = require("@wbe/debug")
debug('foo'); // "currentFileName.js  foo"
```



## Parameters / Props

## Returns

