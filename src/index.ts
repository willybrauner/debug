import path from "path"
import couleur from "./couleur"
import { getCallerFile, randomRgbColor } from "./helpers"

/**
 * debug
 * @param rest
 */
export const debugConfig = {
  enable: true,
}

const keeper = {}

/**
 * debug
 * @param rest
 */
export function debug(...rest: any[]) {
  if (!debugConfig.enable) return

  const file = getCallerFile()
  const fileName = path.basename(file)
  const rgb = randomRgbColor()

  let selected
  if (keeper?.[fileName]) {
    selected = keeper[fileName].split("-")
  } else {
    selected = rgb
    keeper[fileName] = rgb.join("-")
  }

  // TODO select persistante color depend of name
  // TODO add custom namespace
  // TODO test browser

  return console.log(
    `  `,
    couleur.bold(couleur.rgb(selected[0], selected[1], selected[2])(fileName)),
    ``,
    ...rest
  )
}
