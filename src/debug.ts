import { couleur } from "./couleur"
import { isBrowser, stringToRgb } from "./helpers"

let LAST_TIME = Date.now()

/**
 * debug
 * @param namespace - The namespace to log
 * @returns A function that logs the namespace and arguments to the console
 *
 * ex:
 *  import debug from "@wbe/debug"
 * const log = debug("myNamespace")
 * log("Hello World") // logs "myNamespace Hello World +0ms"
 */
export const debug = (namespace?: string, elapsedTime = true) => {
  const rgb = stringToRgb(namespace)

  // Define when to show the log
  const showLog = (value: string): boolean =>
    value?.includes(":*")
      ? namespace.startsWith(value.split(":*")[0])
      : value === namespace || value === "*"

  return (...rest: any[]): void => {
    // check if debug env exist in both environments
    if (!showLog(isBrowser ? localStorage.getItem("debug") : process.env.DEBUG))
      return

    // Calculate elapsed time since last execution
    const now = Date.now()
    const elapsed = now - LAST_TIME
    LAST_TIME = now
    const elapsedString = `+${elapsed}ms`

    // Allow to bypass dropping of console.log from the build process
    // has been test with esbuild drop: ["console"] & pure: ["console.log"]
    const log = console["log"]

    /**
     * Browser environment
     */
    if (isBrowser) {
      const colorStyle = `color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}); font-weight: bold`
      const args = []

      // Start with the colored namespace format specifier and its style
      let format = `%c${namespace}`
      args.push(colorStyle)

      // Process the rest arguments
      // Use %c for strings to allow potential future styling or just display
      // Use %o for objects, arrays, etc., for better inspection
      for (let i = 0; i < rest.length; i++) {
        const arg = rest[i]
        if (typeof arg === "string") {
          format += ` %c${arg}`
          args.push("color: inherit")
        } else {
          format += " %o"
          args.push(arg)
        }
      }
      // Append the elapsed time format specifier and its style
      if (elapsedTime) {
        format += ` %c${elapsedString}`
        args.push(colorStyle)
      }
      // Append the whole formatted string and log it
      args.unshift(format)
      log(...args)
    } else {
      /**
       * Node.js environment
       */

      const wColor = (s: string) =>
        couleur.bold(couleur.rgb(rgb[0], rgb[1], rgb[2])(s))
      elapsedTime
        ? log(wColor(namespace), ...rest, wColor(elapsedString))
        : log(wColor(namespace), ...rest)
    }
  }
}
