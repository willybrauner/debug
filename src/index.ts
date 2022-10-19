/**
 * Export to be able to require module in node/browser env
 *
 * Usage ex:
 *
 *  const debug = require("@wbe/debug")("namespace")
 *  // ...
 *  debug("...")
 *
 */
import { debug } from "./debug"
if (typeof module != "undefined") module.exports = debug

/**
 * Export as es6 module
 *
 * Usage ex:
 *
 *  import debug from "@wbe/debug"
 *  const log = debug("namespace")
 *  // ...
 *  log("...")
 *
 */
export { debug as default } from "./debug"
