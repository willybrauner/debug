import {menu} from "./Menu"
import debug, {couleur} from "@cher-ami/debug"

const log = debug("front:index")

log("index log", {props: "foo"})
log("test 2")

console.log(couleur.bold("hello bold"))
menu()

