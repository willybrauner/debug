import { render } from "preact"
import { BenchmarkApp } from "./App"
import "./styles/main.scss"

localStorage.setItem("debug", "*")
;(() => {
  render(<BenchmarkApp />, document.getElementById("app")!)
})()
