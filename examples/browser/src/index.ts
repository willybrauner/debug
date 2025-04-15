import { menu } from "./Menu"
import debug from "debug"
import debugWbe from "@wbe/debug"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const test = async (lib) => {
  const log = lib("front:index")
  log("index log", { props: "foo" })

  for (let i = 0; i < 10; i++) {
    const log = lib(`front:${i}-coucou`)
    await sleep(10)

    log(`index log ${i}`)
    await sleep(100)
    log(`index log ${i}`)
  }
  lib(`front:others-types`)(
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
}

for (let lib of ["debug-js/debug", "@wbe/debug"]) {
  console.log(
    `---------------------------------------------------  ${lib} ---------------------------------------------------`
  )
  await test(lib === "debug-js/debug" ? debug : debugWbe)
}
