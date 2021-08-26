import couleur from "./couleur"
import { getCallerFile, isBrowser, stringToRgb } from "./helpers"

/**
 * debug
 */
export function debug(...rest: any[]) {
  const callerFile = getCallerFile()
  const fileName = callerFile.substr(callerFile.lastIndexOf("/") + 1)
  const rgb = stringToRgb(fileName)

  if (isBrowser) {
    return localStorage.getItem("debug") === "true" && console.log(
      `%c ${fileName}`,
      `color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}); font-weight: bold;`,
      ...rest
    )
  } else {
    return process.env.DEBUG === "true" && console.log(
      ` `,
      couleur.bold(couleur.rgb(rgb[0], rgb[1], rgb[2])(fileName)),
      ``,
      ...rest
    )
  }
}
