import couleur from "./couleur"
import { isBrowser, stringToRgb } from "./helpers"

/**
 * debug
 */
export const debug = (namespace?: string) => (...rest: any[]): void =>
{
  const rgb = stringToRgb(namespace)

  const showLog = (value: string): boolean =>
    value?.includes(":*")
      ? namespace.startsWith( value.split(":*")[0])
      : value === namespace || value === "*"

  if (isBrowser)
  {
    showLog(localStorage.getItem("debug"))
    &&
    console.log(
      namespace && `%c${namespace}`, `color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
      ...rest
    )
  }
  else
  {
    showLog(process.env.DEBUG)
    &&
    console.log(
      `  `,
      namespace && couleur.bold(couleur.rgb(rgb[0], rgb[1], rgb[2])(namespace)),
      ...rest
    )
  }
}

