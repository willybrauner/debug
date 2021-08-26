/**
 * Check if is browser env
 */
export const isBrowser: boolean = !!(typeof window != "undefined" && window.document)

/**
 * retrive caller function file path
 * @credit: https://github.com/stefanpenner/get-caller-file/blob/master/index.ts
 */
export function getCallerFile(position = 2) {
  if (position >= Error.stackTraceLimit) {
    throw new TypeError("getCallerFile(position) requires position be less then Error.stackTraceLimit but position was: `" + position + "` and Error.stackTraceLimit was: `" + Error.stackTraceLimit + "`")
  }

  const oldPrepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = (_, stack) => stack
  const stack = new Error().stack
  Error.prepareStackTrace = oldPrepareStackTrace

  if (stack !== null && typeof stack === "object") {
    // stack[0] holds this file
    // stack[1] holds where this function was called
    // stack[2] holds the file we're interested in
    return stack[position] ? (stack[position] as any).getFileName() : undefined
  }
}

/**
 * Transform string to RGB
 *
 *
 * @param str
 */
export function stringToRgb(str: string):[number, number, number] {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    let character = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + character
    hash = Math.abs(hash & hash) // Convert to 32bit integer
  }
  const r = (hash & 0xFF0000) >> 16
  const g = (hash & 0x00FF00) >> 8
  const b = hash & 0x0000FF

  return [r, g, b]
}
