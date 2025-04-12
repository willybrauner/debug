import { couleur } from "./couleur"
import { isBrowser, stringToRgb } from "./helpers"

const safeLog = (...args: any[]) => {
  new Function("console", "args", "console.log(...args)")(console, args)
}

// prettier-ignore
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
    safeLog(
      namespace && `%c${namespace}`, `color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
      ...rest
    )
  }
  else
  {
    showLog(process.env.DEBUG)
    &&
    safeLog(
      namespace && couleur.bold(couleur.rgb(rgb[0], rgb[1], rgb[2])(namespace)),
      ...rest
    )
  }
}
