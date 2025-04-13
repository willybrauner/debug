import { couleur } from "./couleur"
import { isBrowser, stringToRgb } from "./helpers"

/**
 * debug
 */
// prettier-ignore
export const debug = (namespace?: string) => (...rest: any[]): void => {
  const rgb = stringToRgb(namespace)

  const showLog = (value: string): boolean =>
    value?.includes(":*")
      ? namespace.startsWith( value.split(":*")[0])
      : value === namespace || value === "*"

  // Allow to bypass dropping of console.log from the build process
  // tested with esbuild config: pure: ["console.log"] or drop: ["console"]
  const log = console['log']

  if (isBrowser)
  {
    showLog(localStorage.getItem("debug"))
    &&
    log(
      namespace && `%c${namespace}`, `color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
      ...rest
    )
  }
  
  else
{
    showLog(process.env.DEBUG)
    &&
    log(
      namespace && couleur.bold(couleur.rgb(rgb[0], rgb[1], rgb[2])(namespace)),
      ...rest
    )
  }
}
