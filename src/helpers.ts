/**
 * retrive caller function file path
 */
export function getCallerFile(): string {
  const originalFunc = Error.prepareStackTrace
  let callerfile
  try {
    let err = new Error()
    let currentfile
    Error.prepareStackTrace = function (_, stack) {
      return stack
    }
    currentfile = err.stack["shift"]().getFileName()
    while (err.stack.length) {
      callerfile = err.stack["shift"]().getFileName()
      if (currentfile !== callerfile) break
    }
  } catch (e) {}
  Error.prepareStackTrace = originalFunc
  return callerfile
}

/**
 * get random HEX color
 */
export function randomHexColor(): string {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

/**
 * Get a random RGB color
 */
export function randomRgbColor(): [number, number, number] {
  const o = Math.round
  const r = Math.random
  const s = 255
  return [o(r() * s), o(r() * s), o(r() * s)]
}
