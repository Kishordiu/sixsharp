import { OHLCV } from '@/hooks/useMarketData'
import { Strategy, StrategyParameters, Signal } from './types'

export interface BacktestConfig {
  initialCapital: number
  transactionCostPct: number
  positionSizingPct: number // e.g. 1.0 for 100% of portfolio
}

export interface Trade {
  type: 'ENTRY' | 'EXIT'
  direction: 'LONG' | 'SHORT'
  time: string
  price: number
  shares: number
  cost: number
  pnl?: number
  pnlPct?: number
}

export interface DailyMetrics {
  time: string
  portfolioValue: number
  cash: number
  holdingsValue: number
  drawdown: number
  dailyReturn: number
}

export interface BacktestResult {
  engineVersion: string
  trades: Trade[]
  dailyMetrics: DailyMetrics[]
  summary: {
    initialCapital: number
    finalValue: number
    totalReturn: number
    annualizedReturn: number
    annualizedVolatility: number
    maxDrawdown: number
    winRate: number
    totalTrades: number
    winningTrades: number
    losingTrades: number
    sharpeRatio: number
    totalFees: number
  }
  assumptions: any
}

/**
 * Core event-driven backtesting engine simulating a real portfolio bar-by-bar
 */
export class BacktestEngine {
  private data: OHLCV[]
  private strategy: Strategy
  private params: StrategyParameters
  private config: BacktestConfig

  constructor(data: OHLCV[], strategy: Strategy, params: StrategyParameters, config: BacktestConfig) {
    this.data = data
    this.strategy = strategy
    this.params = params
    this.config = config
  }

  public run(): BacktestResult {
    const { initialCapital, transactionCostPct, positionSizingPct } = this.config
    
    let cash = initialCapital
    let shares = 0
    let currentPosition: Signal = 0 // 1 = LONG, -1 = SHORT, 0 = FLAT
    let entryPrice = 0

    const trades: Trade[] = []
    const dailyMetrics: DailyMetrics[] = []
    
    let peakValue = initialCapital

    // Bar-by-bar simulation
    let pendingSignal: Signal | null = null

    for (let i = 0; i < this.data.length; i++) {
      const currentBar = this.data[i]
      
      // ==========================================
      // EXECUTION PHASE (t)
      // Execute any pending signals from t-1 at today's OPEN
      // ==========================================
      // @ts-ignore
      if (pendingSignal !== null && (pendingSignal as any) !== 0 && pendingSignal !== currentPosition) {
        // We use the OPEN price of the current bar for execution
        const executionPrice = currentBar.open

        // Exit existing position first if we have one
        if (currentPosition !== 0) {
          const value = shares * executionPrice
          const cost = value * transactionCostPct
          cash += (currentPosition === 1 ? value : -value) - cost
          
          const pnl = currentPosition === 1 ? (executionPrice - entryPrice) * shares : (entryPrice - executionPrice) * shares
          const pnlPct = pnl / (entryPrice * shares)

          trades.push({
            type: 'EXIT',
            direction: currentPosition === 1 ? 'LONG' : 'SHORT',
            time: currentBar.time,
            price: executionPrice,
            shares,
            cost,
            pnl,
            pnlPct
          })
          
          shares = 0
          currentPosition = 0
        }

        // Enter new position if signal is not flat
        if ((pendingSignal as any) !== 0) {
          const allocation = cash * positionSizingPct
          shares = (allocation * (1 - transactionCostPct)) / executionPrice
          const value = shares * executionPrice
          const cost = value * transactionCostPct
          
          cash -= (pendingSignal === 1 ? value : -value) + cost
          entryPrice = executionPrice
          currentPosition = pendingSignal

          trades.push({
            type: 'ENTRY',
            direction: pendingSignal === 1 ? 'LONG' : 'SHORT',
            time: currentBar.time,
            price: executionPrice,
            shares,
            cost
          })
        }
      }
      
      pendingSignal = null // Reset pending signal

      // ==========================================
      // OBSERVATION PHASE (t)
      // Calculate daily MTM using today's CLOSE
      // ==========================================
      const closePrice = currentBar.close
      const holdingsValue = shares * closePrice * (currentPosition === 1 ? 1 : -1)
      const portfolioValue = cash + holdingsValue
      
      if (portfolioValue > peakValue) {
        peakValue = portfolioValue
      }
      
      const drawdown = (peakValue - portfolioValue) / peakValue
      
      const prevValue = i === 0 ? initialCapital : dailyMetrics[i - 1].portfolioValue
      const dailyReturn = (portfolioValue - prevValue) / prevValue

      dailyMetrics.push({
        time: currentBar.time,
        portfolioValue,
        cash,
        holdingsValue,
        drawdown,
        dailyReturn
      })

      // ==========================================
      // DECISION PHASE (t)
      // Generate signal for t+1 based on data up to today's CLOSE
      // ==========================================
      const signal = this.strategy.generateSignal({
        index: i,
        data: this.data,
        parameters: this.params,
        currentPosition
      })
      
      if (signal !== currentPosition) {
        pendingSignal = signal
      }
    }

    // Force close any open position on the last bar
    if (currentPosition !== 0) {
      const lastBar = this.data[this.data.length - 1]
      const price = lastBar.close
      const value = shares * price
      const cost = value * transactionCostPct
      cash += (currentPosition === 1 ? value : -value) - cost
      
      const pnl = currentPosition === 1 ? (price - entryPrice) * shares : (entryPrice - price) * shares
      
      trades.push({
        type: 'EXIT',
        direction: currentPosition === 1 ? 'LONG' : 'SHORT',
        time: lastBar.time,
        price,
        shares,
        cost,
        pnl,
        pnlPct: pnl / (entryPrice * shares)
      })
      
      // Update the last metric
      dailyMetrics[dailyMetrics.length - 1].portfolioValue = cash
      dailyMetrics[dailyMetrics.length - 1].cash = cash
      dailyMetrics[dailyMetrics.length - 1].holdingsValue = 0
    }

    // Calculate Summary Statistics
    const finalValue = dailyMetrics[dailyMetrics.length - 1].portfolioValue
    const totalReturn = (finalValue - initialCapital) / initialCapital
    
    // Annualized return (assuming ~252 trading days per year)
    const years = this.data.length / 252
    const annualizedReturn = Math.pow(1 + totalReturn, 1 / years) - 1

    const maxDrawdown = Math.max(...dailyMetrics.map(d => d.drawdown))
    
    const exitTrades = trades.filter(t => t.type === 'EXIT')
    const winningTradesCount = exitTrades.filter(t => (t.pnl || 0) > 0).length
    const losingTradesCount = exitTrades.length - winningTradesCount
    const winRate = exitTrades.length > 0 
      ? winningTradesCount / exitTrades.length 
      : 0

    // Calculate Sharpe Ratio (Risk-free rate assumed 2%)
    const riskFreeRate = 0.02
    const dailyReturns = dailyMetrics.map(d => d.dailyReturn)
    const avgDailyReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length
    const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - avgDailyReturn, 2), 0) / dailyReturns.length
    const dailyVol = Math.sqrt(variance)
    const annualizedVol = dailyVol * Math.sqrt(252)
    const sharpeRatio = annualizedVol === 0 ? 0 : (annualizedReturn - riskFreeRate) / annualizedVol
    
    const totalFees = trades.reduce((sum, t) => sum + t.cost, 0)

    return {
      engineVersion: 'SIXSHARP_v1',
      trades,
      dailyMetrics,
      summary: {
        initialCapital,
        finalValue,
        totalReturn,
        annualizedReturn,
        annualizedVolatility: annualizedVol,
        maxDrawdown,
        winRate,
        totalTrades: exitTrades.length,
        winningTrades: winningTradesCount,
        losingTrades: losingTradesCount,
        sharpeRatio,
        totalFees
      },
      assumptions: {
        initialCapital,
        transactionCostPct,
        positionSizingPct,
        executionConvention: 'T+1 (Open)',
        riskFreeRate
      }
    }
  }

  /**
   * Generates a buy-and-hold benchmark result for comparison
   */
  public runBenchmark(): BacktestResult {
    const buyAndHoldStrategy: Strategy = {
      id: 'benchmark',
      name: 'Buy and Hold',
      description: 'Buy on day 1 and hold.',
      defaultParameters: {},
      validateParameters: () => null,
      generateSignal: () => 1 as Signal // Always LONG
    }

    const engine = new BacktestEngine(this.data, buyAndHoldStrategy, {}, this.config)
    return engine.run()
  }
}
