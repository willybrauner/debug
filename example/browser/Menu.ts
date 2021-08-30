import debug from "../../dist"
const log = debug("front:Menu");

export const menu = () => {
  log("Menulog", "again", {test: "foo"}, "bar");
}
