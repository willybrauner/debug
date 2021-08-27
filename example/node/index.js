const debug = require("../../dist")("config:coucou-node")
require("../../dist")("config:hello")("coucou ceci est un log test",
  { test: true })

const test = {
  test: true,
  tes: true,
  tet: true,
  slsl: true,
  slslqsmlqmsl: true
}

require("../../dist")("config:my-task")(test)
