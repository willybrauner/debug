/**
 * Check if is browser env
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/**
 * Transform string to RGB
 * @param str
 */
export function stringToRgb(str: string): [number, number, number] {
  if (!str) return [128, 128, 128]

  // Add a salt to make numbers at the end produce different colors
  const salt = "x7f2q9"
  const stringToHash = str + salt

  let hash = 0
  for (let i = 0; i < stringToHash.length; i++) {
    let character = stringToHash.charCodeAt(i)
    hash = (hash << 5) - hash + character
    hash = Math.abs(hash & hash)
  }

  // Create more variance in the RGB values
  const r = (hash & 0xff0000) >> 16
  const g = ((hash >> 3) & 0x00ff00) >> 8
  const b = (hash >> 6) & 0x0000ff

  return [r, g, b]
}

/**
 * ansi RGB
 */
// Wraper for ansi 256 code
const _wrapAnsi256 = (code) => `\u001B[${38};5;${code}m`
// Convert RGB color to ansi 256
const _rgbToAnsi256 = (red: number, green: number, blue: number): number => {
  if (red === green && green === blue) {
    if (red < 8) return 16
    if (red > 248) return 231
    return Math.round(((red - 8) / 247) * 24) + 232
  }
  return (
    16 +
    36 * Math.round((red / 255) * 5) +
    6 * Math.round((green / 255) * 5) +
    Math.round((blue / 255) * 5)
  )
}
export function ansiRgb(r: number, g: number, b: number) {
  return function (str: string): string {
    const _close = "\u001B[39m"
    return _wrapAnsi256(_rgbToAnsi256(r, g, b)) + str + _close
  }
}
