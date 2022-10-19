import debug from "@wbe/debug"
const log = debug("front:menu")
export const menu = () => {
  log("Menu log", {test: "foo"}, "bar");
}
