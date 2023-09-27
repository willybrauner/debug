import debug from "@cher-ami/debug"
const log = debug("front:menu")
export const menu = () => {
  log("Menu log", {test: "foo"}, "bar");
}
