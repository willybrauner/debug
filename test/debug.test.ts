import { describe, it, expect, beforeEach, afterEach } from "vitest"
import debug from "../src"

describe("debug", () => {
  // Mock console.log
  const originalConsoleLog = console.log
  let consoleLogCalls: any[][] = []

  beforeEach(() => {
    // Reset mock calls before each test
    consoleLogCalls = []
    console.log = (...args: any[]) => {
      consoleLogCalls.push(args)
      return originalConsoleLog(...args)
    }
  })

  afterEach(() => {
    // Restore original console.log
    console.log = originalConsoleLog
    // Clear process.env.DEBUG
    delete process.env.DEBUG
  })

  it("should log only if we add DEBUG={namespace} as env var", () => {
    // Test when DEBUG equals the namespace
    process.env.DEBUG = "test-namespace"
    const testDebug = debug("test-namespace")
    testDebug("Test message")
    expect(consoleLogCalls.length).toBe(1)
    expect(consoleLogCalls[0][1]).toBe("Test message")

    // Test when DEBUG equals *
    process.env.DEBUG = "*"
    const testDebugWildcard = debug("any-namespace")
    testDebugWildcard("Wildcard test")
    expect(consoleLogCalls.length).toBe(2)
    expect(consoleLogCalls[1][1]).toBe("Wildcard test")

    // Test when DEBUG uses wildcard prefix (namespace:*)
    process.env.DEBUG = "prefix:*"
    const testDebugPrefix = debug("prefix:something")
    testDebugPrefix("Prefix test")
    expect(consoleLogCalls.length).toBe(3)
    expect(consoleLogCalls[2][1]).toBe("Prefix test")

    // Test when DEBUG doesn't match
    process.env.DEBUG = "different-namespace"
    const testNoDebug = debug("test-namespace")
    testNoDebug("Should not log")
    expect(consoleLogCalls.length).toBe(3) // Count shouldn't increase
  })

  it("should log only logs from a spectific namespace", () => {
    // Create multiple debug loggers with different namespaces
    const debug1 = debug("namespace1")
    const debug2 = debug("namespace2")
    const debug3 = debug("namespace3")

    // Set DEBUG to only match one namespace
    process.env.DEBUG = "namespace2"

    // Call all loggers
    debug1("Message from namespace1")
    debug2("Message from namespace2")
    debug3("Message from namespace3")

    // Verify only namespace2 logged a message
    expect(consoleLogCalls.length).toBe(1)
    expect(consoleLogCalls[0][1]).toBe("Message from namespace2")
  })

  it("should not handle undefined namespace", () => {
    process.env.DEBUG = "*"
    const testDebug = debug(undefined)
    testDebug("Test with undefined namespace")
    expect(consoleLogCalls.length).toBe(1)
  })

  it("should log multiple arguments correctly", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    process.env.DEBUG = "test-namespace"
    const testDebug = debug("test-namespace")
    testDebug("First argument", "Second argument", { key: "value" }, 123)
    expect(consoleLogCalls.length).toBe(1)
    expect(consoleLogCalls[0][1]).toBe("First argument")
    expect(consoleLogCalls[0][2]).toBe("Second argument")
    expect(consoleLogCalls[0][3]).toEqual({ key: "value" })
    expect(consoleLogCalls[0][4]).toBe(123)
  })

  it("should not log when DEBUG is not set", () => {
    // DEBUG is already deleted in afterEach
    const testDebug = debug("test-namespace")
    testDebug("Should not log")
    expect(consoleLogCalls.length).toBe(0)
  })

  it("should handle multiple debug namespaces", () => {
    process.env.DEBUG = "one,two,three,fo*,five:*,seven";
    const debug1 = debug("one")
    const debug2 = debug("two")
    const debug3 = debug("three")
    const debug4 = debug("four")
    const debug5 = debug("fort")
    const debug6 = debug("five:five-test")
    const debug7 = debug("five:five-six")
    const debug8 = debug("seven")
    
    debug1("Should log one")
    debug2("Should log two")
    debug3("Should log three")
    debug4("Should log four")
    debug5("Should log fort")
    debug6("Should log five")
    debug7("Should log six")
    debug8("Should log seven")

    expect(consoleLogCalls.length).toBe(8)
    expect(consoleLogCalls[0][0]).toContain("one")
    expect(consoleLogCalls[0][1]).toBe("Should log one")
    expect(consoleLogCalls[1][0]).toContain("two")
    expect(consoleLogCalls[1][1]).toBe("Should log two")
    expect(consoleLogCalls[2][0]).toContain("three")
    expect(consoleLogCalls[2][1]).toBe("Should log three")
    expect(consoleLogCalls[3][0]).toContain("four")
    expect(consoleLogCalls[3][1]).toBe("Should log four")
    expect(consoleLogCalls[4][0]).toContain("fort")
    expect(consoleLogCalls[4][1]).toBe("Should log fort")
    expect(consoleLogCalls[5][0]).toContain("five")
    expect(consoleLogCalls[5][1]).toBe("Should log five")
    expect(consoleLogCalls[6][0]).toContain("six")
    expect(consoleLogCalls[6][1]).toBe("Should log six")
    expect(consoleLogCalls[7][0]).toContain("seven")
    expect(consoleLogCalls[7][1]).toBe("Should log seven")
  })
})
