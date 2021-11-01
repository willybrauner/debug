const debug = require("../../dist")

const log = debug("front:index");
log("Welcome debug!");
log("Project version", "1.0.0");

const log2 = debug("front:menu");
log2("Hello menu!")
log2("Menu is open", true)

const log3 = debug("front:header");
log3("Hello header!")

const log4 = debug("front:very-long-namespace-1");
log4("Hello namespace!")
log4(10)
log4({ foo: "bar" })

const configLog1 = debug("config:task-1")
configLog1("hello config:* namespace logs!")
configLog1("This on is print only if localstorage debug value is set as 'config:*' or 'config:task-1'")
