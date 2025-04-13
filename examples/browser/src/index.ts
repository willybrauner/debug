import { menu } from "./Menu"
import debug, { couleur } from "@wbe/debug"
;(async () => {
  const log = debug("front:index")
  log("index log", { props: "foo" })

  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) =>
      setTimeout(resolve, 100 * Math.random() + 100 / 100)
    )
    debug(`front:${i + "-test"}`)(`index log ${i}`)
  }
  debug(`front:others-types`)(
    `new log`,
    [
      { name: "foo", value: "bar" },
      { name: "bar", value: "foo" },
      { name: "baz", value: "qux" },
      { name: "qux", value: "baz" },
    ],
    null,
    undefined,
    "foo"
  )
  menu()

  console.log("native console log (should be removed by esbuild in production)")

  for (let i = 0; i < 3; i++) {
    console.log("native console log", i)
  }
})()
