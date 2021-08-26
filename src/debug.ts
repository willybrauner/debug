import couleur from "./couleur"
import { getCallerFile, isBrowser, randomRgbColor } from "./helpers"

/**
 * debug
 * @param rest
 */
export const debugConfig = {
  enable: true
}

const keeper = {}

/**
 * debug
 * @param rest
 */
export function debug(...rest: any[]) {
  if (!debugConfig.enable) return

  const file = getCallerFile()
  const fileName = file.substr(file.lastIndexOf("/") + 1)
  const rgb = randomRgbColor()

  let selected
  if (keeper?.[fileName]) {
    selected = keeper[fileName].split("-")
  } else {
    selected = rgb
    keeper[fileName] = rgb.join("-")
  }

  // TODO Add local storage
  // TODO add custom namespace ?
  // TODO select persistante color depend of name

  if (isBrowser) {
    console.log(
      `%c ${fileName}`,
      `color: rgb(${selected[0]}, ${selected[1]}, ${selected[2]}); font-weight: bold;`,
      ...rest
    )
  } else {
    return console.log(
      ` `,
      couleur.bold(couleur.rgb(selected[0], selected[1], selected[2])(fileName)),
      ``,
      ...rest
    )
  }
}
