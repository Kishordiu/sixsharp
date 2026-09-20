import { describe, it, expect } from 'vitest'
import { BacktestEngine, BacktestConfig } from './engine'
import { SMACrossover } from './strategies'
import { OHLCV } from '@/hooks/useMarketData'
import type { Strategy, Signal } from './types'

describe('BacktestEngine', () => {
  // Generate some dummy trending data
  const generateDummyData = (): OHLCV[] => {
    const data: OHLCV[] = []
    let price = 100
    for (let i = 0; i < 100; i++) {
      // Create a clear uptrend for the first 50 days, then downtrend
      if (i < 50) price += 2
      else price -= 2
      
      data.push({
        time: `2024-01-${String(i+1).padStart(2, '0')}`,
        open: price,
        high: price + 1,
        low: price - 1,
        close: price,
        volume: 1000
      })
    }
    return data
  }

  const dummyData = generateDummyData()
  const config: BacktestConfig = {
    initialCapital: 10000,
    transactionCostPct: 0.001, // 0.1% fee
    positionSizingPct: 1.0 // 100% allocation
  }

  it('runs a backtest and generates trades', () => {
    const engine = new BacktestEngine(dummyData, SMACrossover, { fastPeriod: 5, slowPeriod: 10 }, config)
    const result = engine.run()

    expect(result.trades.length).toBeGreaterThan(0)
    expect(result.dailyMetrics.length).toBe(dummyData.length)
    
    // First metric should have initial capital if no trade on day 1
    expect(result.dailyMetrics[0].portfolioValue).toBe(10000)

    // Summary should be calculated
    expect(result.summary.totalTrades).toBeGreaterThan(0)
    expect(result.summary.finalValue).toBeDefined()
  })

  it('runs benchmark correctly', () => {
    const engine = new BacktestEngine(dummyData, SMACrossover, { fastPeriod: 5, slowPeriod: 10 }, config)
    const benchmark = engine.runBenchmark()

    // Benchmark should buy once on day 1 and sell on last day
    expect(benchmark.trades.length).toBe(2)
    expect(benchmark.trades[0].type).toBe('ENTRY')
    expect(benchmark.trades[1].type).toBe('EXIT')
  })

  it('proves t+1 execution (no look-ahead bias)', () => {
    // Strategy that buys on day 10
    const delayedStrategy: Strategy = {
      id: 'test',
      name: 'Test',
      description: 'test',
      defaultParameters: {},
      validateParameters: () => null,
      generateSignal: ({ index }: { index: number }) => (index >= 10 ? 1 : 0) as Signal // Signal starts at index 10 (11th day)
    }

    const engine = new BacktestEngine(dummyData, delayedStrategy, {}, config)
    const result = engine.run()
    
    // The signal was generated on day index 10.
    // Therefore, execution MUST happen at the OPEN of day index 11.
    const entryTrade = result.trades[0]
    expect(entryTrade.time).toBe(dummyData[11].time)
    expect(entryTrade.price).toBe(dummyData[11].open)
  })

  it('respects initial capital and prevents over-leveraging', () => {
    // Strategy that tries to buy endlessly
    const greedyStrategy: Strategy = {
      id: 'greedy',
      name: 'Greedy',
      description: 'greedy',
      defaultParameters: {},
      validateParameters: () => null,
      generateSignal: () => 1 as Signal // Always LONG
    }

    const lowCapitalConfig = {
      initialCapital: 100, // Very low capital
      transactionCostPct: 0,
      positionSizingPct: 1.0
    }

    const engine = new BacktestEngine(dummyData, greedyStrategy, {}, lowCapitalConfig)
    const result = engine.run()
    
    // Day 2 opens at 102. Capital is 100.
    // Cannot even buy 1 full share if we strictly require price <= cash, 
    // but the engine currently calculates `shares = cash / price`.
    // Let's verify that cash never goes negative and total value tracks correctly.
    const minCash = Math.min(...result.dailyMetrics.map(m => m.cash))
    expect(minCash).toBeGreaterThanOrEqual(0)
  })

  it('applies slippage/fees strictly reducing equity', () => {
    const feeConfig = {
      initialCapital: 10000,
      transactionCostPct: 0.05, // 5% fee for extreme testing
      positionSizingPct: 1.0
    }

    const engine = new BacktestEngine(dummyData, SMACrossover, { fastPeriod: 5, slowPeriod: 10 }, feeConfig)
    const result = engine.run()

    // Assuming it makes trades, the high fees should drastically impact final equity vs a no-fee benchmark
    const zeroFeeConfig = { ...feeConfig, transactionCostPct: 0 }
    const zeroFeeEngine = new BacktestEngine(dummyData, SMACrossover, { fastPeriod: 5, slowPeriod: 10 }, zeroFeeConfig)
    const zeroFeeResult = zeroFeeEngine.run()

    expect(result.summary.totalFees).toBeGreaterThan(0)
    expect(result.summary.finalValue).toBeLessThan(zeroFeeResult.summary.finalValue)
  })
})
