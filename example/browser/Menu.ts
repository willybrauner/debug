import debug from "../../src"
const log = debug("front:Menu");

export const menu = () => {
  log("Menulog", "encore", {test: "foo"}, "bar");
}
