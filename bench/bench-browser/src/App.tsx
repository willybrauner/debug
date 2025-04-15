import { useState, useEffect } from "preact/hooks"
import debugOriginal from "debug"
import debugWbe from "@wbe/debug"

interface BenchmarkResults {
  debugOriginal: number
  debugWbe: number
  iterations: number
  testMessages: any[]
  completed: boolean
}

export const BenchmarkApp = () => {
  const [results, setResults] = useState<BenchmarkResults>({
    debugOriginal: 0,
    debugWbe: 0,
    iterations: 10000,
    testMessages: [],
    completed: false,
  })
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    runBenchmark()
  }, [])

  const runBenchmark = async () => {
    setIsRunning(true)

    const logBench = debugWbe("bench:main")
    logBench("Starting browser benchmark...")

    // Setup for benchmarking
    const iterations = results.iterations
    const benchResults = {
      debugOriginal: 0,
      debugWbe: 0,
    }

    // Create loggers for each library
    const logOriginal = debugOriginal("bench:original")
    const logWbe = debugWbe("bench:wbe")

    // Warmup phase - warm up both libraries more thoroughly
    logBench("Warming up...")
    for (let i = 0; i < 1000; i++) {
      logOriginal("warmup")
      logWbe("warmup")
    }

    // Setup test messages with different complexity
    const testMessages = [
      "Simple string message",
      ["Array", "of", "strings"],
      { complex: "object", with: { nested: "properties" } },
      ["Mixed", 123, { type: "content" }],
    ]

    // Update state with test messages
    setResults((prev) => ({ ...prev, testMessages }))

    // Run multiple rounds of benchmarking in alternating order
    const numberOfRounds = 4
    const roundResults = {
      debugOriginal: [] as number[],
      debugWbe: [] as number[],
    }

    logBench(
      `Running ${numberOfRounds} rounds of benchmarks in alternating order...`
    )

    for (let round = 0; round < numberOfRounds; round++) {
      logBench(`Round ${round + 1}/${numberOfRounds}`)

      // Determine order based on round number (alternate)
      const runFirstSecond =
        round % 2 === 0
          ? [runOriginalBenchmark, runWbeBenchmark]
          : [runWbeBenchmark, runOriginalBenchmark]

      // Run benchmarks in determined order
      await new Promise((resolve) => setTimeout(resolve, 100)) // Small pause between rounds
      const result1 = await runFirstSecond[0]()
      await new Promise((resolve) => setTimeout(resolve, 100)) // Small pause between tests
      const result2 = await runFirstSecond[1]()

      // Store results in correct slots regardless of execution order
      if (round % 2 === 0) {
        roundResults.debugOriginal.push(result1)
        roundResults.debugWbe.push(result2)
      } else {
        roundResults.debugWbe.push(result1)
        roundResults.debugOriginal.push(result2)
      }
    }

    // Calculate average results
    benchResults.debugOriginal =
      roundResults.debugOriginal.reduce((a, b) => a + b, 0) / numberOfRounds
    benchResults.debugWbe =
      roundResults.debugWbe.reduce((a, b) => a + b, 0) / numberOfRounds

    logBench("All benchmark rounds completed.")

    // Function to benchmark original debug
    async function runOriginalBenchmark() {
      logBench("Benchmarking original debug library...")
      const start = performance.now()

      for (let i = 0; i < iterations; i++) {
        const msgIndex = i % testMessages.length
        logOriginal(testMessages[msgIndex])
      }

      const duration = performance.now() - start
      logBench(`Original debug completed in ${duration.toFixed(2)}ms`)
      return duration
    }

    // Function to benchmark @wbe/debug
    async function runWbeBenchmark() {
      logBench("Benchmarking @wbe/debug library...")
      const start = performance.now()

      for (let i = 0; i < iterations; i++) {
        const msgIndex = i % testMessages.length
        logWbe(testMessages[msgIndex])
      }

      const duration = performance.now() - start
      logBench(`@wbe/debug completed in ${duration.toFixed(2)}ms`)
      return duration
    }

    // Display results
    logBench("Browser benchmark completed.")

    console.log(
      "%c---- BENCHMARK RESULTS ----",
      "font-weight: bold; font-size: 16px;"
    )
    console.log(`Total iterations per library: ${iterations}`)
    console.log(
      `Original debug: ${benchResults.debugOriginal.toFixed(2)}ms (${(
        benchResults.debugOriginal / iterations
      ).toFixed(3)}ms per call)`
    )
    console.log(
      `@wbe/debug: ${benchResults.debugWbe.toFixed(2)}ms (${(
        benchResults.debugWbe / iterations
      ).toFixed(3)}ms per call)`
    )
    console.log(
      `Difference: ${(
        benchResults.debugWbe - benchResults.debugOriginal
      ).toFixed(2)}ms`
    )

    if (benchResults.debugWbe < benchResults.debugOriginal) {
      console.log(
        `%c@wbe/debug is ${(
          (benchResults.debugOriginal / benchResults.debugWbe - 1) *
          100
        ).toFixed(2)}% faster`,
        "color: green; font-weight: bold"
      )
    } else {
      console.log(
        `%cOriginal debug is ${(
          (benchResults.debugWbe / benchResults.debugOriginal - 1) *
          100
        ).toFixed(2)}% faster`,
        "color: red; font-weight: bold"
      )
    }

    // Update state with results
    setResults({
      debugOriginal: benchResults.debugOriginal,
      debugWbe: benchResults.debugWbe,
      iterations,
      testMessages,
      completed: true,
    })

    setIsRunning(false)
  }

  return (
    <div>
      <div className="actions">
        <button onClick={runBenchmark} disabled={isRunning} className="run-btn">
          {isRunning ? "Running..." : "Run Benchmark Again"}
        </button>
      </div>

      {results.completed && <BenchmarkResults results={results} />}
    </div>
  )
}

const BenchmarkResults = ({ results }: { results: BenchmarkResults }) => {
  const { debugOriginal, debugWbe, iterations, testMessages } = results

  const originalPerCall = debugOriginal / iterations
  const wbePerCall = debugWbe / iterations
  const difference = debugWbe - debugOriginal

  // Calculate percentage difference
  const isWbeFaster = debugWbe < debugOriginal
  const percentDiff = isWbeFaster
    ? ((debugOriginal / debugWbe - 1) * 100).toFixed(2)
    : ((debugWbe / debugOriginal - 1) * 100).toFixed(2)

  // Calculate bar widths
  const maxTime = Math.max(debugOriginal, debugWbe)
  const originalBarWidth = `${Math.min(100, (debugOriginal / maxTime) * 100)}%`
  const wbeBarWidth = `${Math.min(100, (debugWbe / maxTime) * 100)}%`

  return (
    <div className="results">
      <h2>Benchmark Results</h2>

      <div className="summary">
        <p>
          Total iterations per library: <strong>{iterations}</strong>
        </p>
        <p className="winner" style={{ color: isWbeFaster ? "green" : "red" }}>
          <strong>
            {isWbeFaster
              ? `@wbe/debug is ${percentDiff}% faster`
              : `Original debug is ${percentDiff}% faster`}
          </strong>
        </p>
      </div>

      <div className="result-bars">
        <div className="bar-container">
          <div className="bar-label">
            Original debug: {debugOriginal.toFixed(2)}ms (
            {originalPerCall.toFixed(3)}ms per call)
          </div>
          <div className="bar original-bar" style={{ width: originalBarWidth }}>
            {originalPerCall.toFixed(3)}ms
          </div>
        </div>

        <div className="bar-container">
          <div className="bar-label">
            @wbe/debug: {debugWbe.toFixed(2)}ms ({wbePerCall.toFixed(3)}ms per
            call)
          </div>
          <div className="bar wbe-bar" style={{ width: wbeBarWidth }}>
            {wbePerCall.toFixed(3)}ms
          </div>
        </div>
      </div>

      <div className="difference">
        <p>Difference: {difference.toFixed(2)}ms</p>
      </div>

      <div className="test-details">
        <h3>Test Details</h3>
        <ul>
          <li>Iterations: {iterations}</li>
          <li>Test performed on: {new Date().toLocaleString()}</li>
          <li>Browser: {navigator.userAgent}</li>
        </ul>

        <h3>Test Messages</h3>
        <pre>{JSON.stringify(testMessages, null, 2)}</pre>
      </div>
    </div>
  )
}
