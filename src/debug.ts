import { ansiRgb, isBrowser, stringToRgb } from "./helpers"

// Store timers per namespace instead of using a global timer
let TIMERS: Record<string, number> = {}

// Maximum number of namespaces to track before cleanup
const MAX_NAMESPACES = 1000

/**
 * debug
 * @param namespace - The namespace to log
 * @param elapsedTime - Whether to show elapsed time since the last log
 * @returns A function that logs the namespace and arguments to the console
 */
export const debug = (namespace?: string, elapsedTime = true) => {
  const rgb = stringToRgb(namespace)

  // Define when to show the log
  const showLog = (value: string): boolean => {
    const debugSpecs = value?.split(',');
    return debugSpecs?.some(spec => {
      const fragment = spec.split(/(?:\*\:)|(?:\*)/)[0];
      return value==="*" || namespace.startsWith(fragment)
    });
  }

  return (...rest: any[]): void => {
    // check if debug env exist in both environments
    if (
      !showLog(isBrowser() ? localStorage.getItem("debug") : process.env.DEBUG)
    )
      return

    // Calculate elapsed time for each namespace to avoid global state & Cleanup if needed
    const now = Date.now()
    let elapsed = 0
    if (TIMERS[namespace]) {
      elapsed = now - TIMERS[namespace]
    } else {
      if (Object.keys(TIMERS).length >= MAX_NAMESPACES) {
        TIMERS = {}
      }
    }
    TIMERS[namespace] = now
    const elapsedString =
      elapsed > 1000 ? `+${Math.floor(elapsed / 1000)}s` : `+${elapsed}ms`

    // Allow to bypass dropping of console.log from the build process
    // has been test with esbuild drop: ["console"] & pure: ["console.log"]
    const log = console["log"]

    /**
     * Browser environment
     */
    if (isBrowser()) {
      const colorStyle = `color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]});`
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
      const wColor = (s: string) => ansiRgb(rgb[0], rgb[1], rgb[2])(s)
      const nspace = wColor(namespace)
      elapsedTime
        ? log(nspace, ...rest, wColor(elapsedString))
        : log(nspace, ...rest)
    }
  }
}
