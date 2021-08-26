import couleur from "./couleur"
import { getCallerFile, isBrowser, randomRgbColor } from "./helpers"


const keeper = {}
/**
 * debug
 */
export function debug(...rest: any[]) {
  const callerFile = getCallerFile()
  const fileName = callerFile.substr(callerFile.lastIndexOf("/") + 1)
  const rgb = randomRgbColor()

  let selectedRgb
  if (keeper?.[fileName]) {
    selectedRgb = keeper[fileName].split("-")
  } else {
    selectedRgb = rgb
    keeper[fileName] = rgb.join("-")
  }

  // TODO Add local storage
  // TODO add custom namespace ?
  // TODO select persistante color depend of name

  if (isBrowser) {
    console.log(
      `%c ${fileName}`,
      `color: rgb(${selectedRgb[0]}, ${selectedRgb[1]}, ${selectedRgb[2]}); font-weight: bold;`,
      ...rest
    )
  } else {
    return console.log(
      ` `,
      couleur.bold(couleur.rgb(selectedRgb[0], selectedRgb[1], selectedRgb[2])(fileName)),
      ``,
      ...rest
    )
  }
}
