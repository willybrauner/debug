import debugOriginal from "debug"
import debugWbe from "@wbe/debug"
import chalk from "chalk"

// Enable logs for both libraries
process.env.DEBUG = "*"

// Function to format numbers with commas for better readability
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * Benchmark class to compare @wbe/debug vs debug performances
 */
class Benchmark {
  private readonly iterations: number
  private readonly warmupIterations: number
  private results: {
    debugOriginal: number
    debugWbe: number
  }
  private testMessages: any[]

  constructor(iterations: number = 100000, warmupIterations: number = 1000) {
    this.iterations = iterations
    this.warmupIterations = warmupIterations
    this.results = {
      debugOriginal: 0,
      debugWbe: 0,
    }

    // Create a variety of test messages to use in benchmarks
    this.testMessages = [
      "Simple string message",
      ["Array", "of", "strings"],
      { complex: "object", with: { nested: "properties" } },
      ["Mixed", 123, { type: "content" }],
    ]
  }

  /**
   * Run warmup phase to initialize both libraries
   */
  private warmup(): void {
    console.log(chalk.dim("Warming up..."))

    const logOriginal = debugOriginal("bench:original:warmup")
    const logWbe = debugWbe("bench:wbe:warmup")

    for (let i = 0; i < this.warmupIterations; i++) {
      logOriginal("warmup")
      logWbe("warmup")
    }
  }

  /**
   * Benchmark the original debug library
   */
  private benchmarkOriginal(): void {
    console.log(
      chalk.blue.bold(
        `\nBenchmarking ${chalk.underline("original debug")} library...`
      )
    )

    const logOriginal = debugOriginal("bench:original")
    const start = process.hrtime.bigint()

    for (let i = 0; i < this.iterations; i++) {
      const msgIndex = i % this.testMessages.length
      logOriginal(this.testMessages[msgIndex])
    }

    const end = process.hrtime.bigint()
    this.results.debugOriginal = Number(end - start) / 1_000_000 // Convert to ms
  }

  /**
   * Benchmark the @wbe/debug library
   */
  private benchmarkWbe(): void {
    console.log(
      chalk.green.bold(
        `\nBenchmarking ${chalk.underline("@wbe/debug")} library...`
      )
    )

    const logWbe = debugWbe("bench:wbe")
    const start = process.hrtime.bigint()

    for (let i = 0; i < this.iterations; i++) {
      const msgIndex = i % this.testMessages.length
      logWbe(this.testMessages[msgIndex])
    }

    const end = process.hrtime.bigint()
    this.results.debugWbe = Number(end - start) / 1_000_000 // Convert to ms
  }

  /**
   * Display the benchmark results
   */
  private displayResults(): void {
    console.log("\n" + chalk.yellow.bold("=".repeat(50)))
    console.log(chalk.yellow.bold("           BENCHMARK RESULTS"))
    console.log(chalk.yellow.bold("=".repeat(50)) + "\n")

    const { debugOriginal, debugWbe } = this.results

    console.log(
      `Total iterations per library: ${chalk.bold(
        formatNumber(this.iterations)
      )}`
    )
    console.log(
      `Test messages: ${chalk.dim(JSON.stringify(this.testMessages))}\n`
    )

    // Calculate per-operation times
    const originalPerOp = debugOriginal / this.iterations
    const wbePerOp = debugWbe / this.iterations

    // Display the results for the original debug library
    console.log(chalk.blue.bold("Original debug:"))
    console.log(`  Total time: ${chalk.bold(debugOriginal.toFixed(2) + " ms")}`)
    console.log(
      `  Per operation: ${chalk.bold(originalPerOp.toFixed(6) + " ms")}\n`
    )

    // Display the results for @wbe/debug
    console.log(chalk.green.bold("@wbe/debug:"))
    console.log(`  Total time: ${chalk.bold(debugWbe.toFixed(2) + " ms")}`)
    console.log(`  Per operation: ${chalk.bold(wbePerOp.toFixed(6) + " ms")}\n`)

    // Display the difference
    const diff = debugWbe - debugOriginal
    console.log(
      `Absolute difference: ${chalk.bold(Math.abs(diff).toFixed(2) + " ms")}`
    )

    // Calculate which one is faster
    if (debugWbe < debugOriginal) {
      const percentFaster = ((debugOriginal / debugWbe - 1) * 100).toFixed(2)
      console.log(
        chalk.green.bold(
          `@wbe/debug is ${percentFaster}% faster than original debug`
        )
      )
    } else {
      const percentFaster = ((debugWbe / debugOriginal - 1) * 100).toFixed(2)
      console.log(
        chalk.blue.bold(
          `Original debug is ${percentFaster}% faster than @wbe/debug`
        )
      )
    }

    // Display a simple visualization of the results
    this.displayVisualization()
  }

  /**
   * Display a simple ASCII visualization of the benchmark results
   */
  private displayVisualization(): void {
    const { debugOriginal, debugWbe } = this.results
    const maxTime = Math.max(debugOriginal, debugWbe)

    // Calculate bar lengths (max 40 chars)
    const maxBarLength = 40
    const originalBarLength = Math.round(
      (debugOriginal / maxTime) * maxBarLength
    )
    const wbeBarLength = Math.round((debugWbe / maxTime) * maxBarLength)

    console.log("\n" + chalk.yellow.bold("Performance Comparison:"))

    // Original debug bar
    process.stdout.write(chalk.blue.bold("Original debug: "))
    process.stdout.write(chalk.blue("█".repeat(originalBarLength)))
    console.log(` ${debugOriginal.toFixed(2)} ms`)

    // @wbe/debug bar
    process.stdout.write(chalk.green.bold("@wbe/debug:    "))
    process.stdout.write(chalk.green("█".repeat(wbeBarLength)))
    console.log(` ${debugWbe.toFixed(2)} ms`)

    console.log("\n" + chalk.yellow.bold("=".repeat(50)))
  }

  /**
   * Run the complete benchmark
   */
  public async run(): Promise<void> {
    console.log(
      chalk.bold("\n🚀 Starting Node.js benchmark: @wbe/debug vs debug")
    )
    console.log(
      chalk.dim(`Running with ${formatNumber(this.iterations)} iterations`)
    )

    // First warm up
    this.warmup()

    // Benchmark original debug
    this.benchmarkOriginal()

    // Benchmark @wbe/debug
    this.benchmarkWbe()

    // Display results
    this.displayResults()
  }
}

// Run the benchmark with 100,000 iterations
const benchmark = new Benchmark(100000)
benchmark.run().catch(console.error)
