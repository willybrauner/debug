import couleur from "./couleur"
import { getCallerFile, isBrowser, stringToRgb } from "./helpers"

const keeper = {}

/**
 * debug
 */
export function debug(...rest: any[]) {
  const callerFile = getCallerFile()
  const fileName = callerFile.substr(callerFile.lastIndexOf("/") + 1)
  const rgb = stringToRgb(fileName)

  let selectedRgb
  if (keeper?.[fileName]) {
    selectedRgb = keeper[fileName].split("-")
  } else {
    selectedRgb = rgb
    keeper[fileName] = rgb.join("-")
  }

  // TODO add custom namespace ?

  if (isBrowser) {
    return localStorage.getItem("debug") === "true" && console.log(
      `%c ${fileName}`,
      `color: rgb(${selectedRgb[0]}, ${selectedRgb[1]}, ${selectedRgb[2]}); font-weight: bold;`,
      ...rest
    )
  } else {
    return process.env.DEBUG === "true" && console.log(
      ` `,
      couleur.bold(couleur.rgb(selectedRgb[0], selectedRgb[1], selectedRgb[2])(fileName)),
      ``,
      ...rest
    )
  }
}
