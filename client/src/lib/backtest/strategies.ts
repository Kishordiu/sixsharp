import type { Strategy, Signal } from './types'
import { calculateSMA, calculateEMA } from '../quant/indicators'
// We will use standard array slicing for indicators on the fly or pre-calculate them. 
// For a bar-by-bar engine, pre-calculating indicators is much more efficient.
// We'll calculate indicators up to 'index' and use the latest value.

// Utility to get prices
const getPrices = (data: any[]) => data.map(d => d.close)

export const SMACrossover: Strategy = {
  id: 'sma_crossover',
  name: 'SMA Crossover',
  description: 'Goes LONG when fast SMA crosses above slow SMA. Goes SHORT when fast SMA crosses below slow SMA.',
  defaultParameters: {
    fastPeriod: 10,
    slowPeriod: 30,
  },
  validateParameters: (params) => {
    if (params.fastPeriod <= 0 || params.slowPeriod <= 0) return "Periods must be greater than 0"
    if (params.fastPeriod >= params.slowPeriod) return "Fast period must be strictly less than slow period"
    return null
  },
  generateSignal: ({ index, data, parameters, currentPosition }): Signal => {
    const { fastPeriod, slowPeriod } = parameters
    
    // Need enough data
    if (index < slowPeriod) return 0

    // For efficiency in a real system we wouldn't recalculate the entire array every bar, 
    // but for this implementation we slice up to the current index.
    const prices = getPrices(data.slice(0, index + 1))
    const fastSma = calculateSMA(prices, fastPeriod)
    const slowSma = calculateSMA(prices, slowPeriod)

    const currentFast = fastSma[fastSma.length - 1]
    const currentSlow = slowSma[slowSma.length - 1]
    const prevFast = fastSma[fastSma.length - 2]
    const prevSlow = slowSma[slowSma.length - 2]

    // Cross up
    if (prevFast <= prevSlow && currentFast > currentSlow) {
      return 1
    }
    // Cross down
    if (prevFast >= prevSlow && currentFast < currentSlow) {
      return -1
    }

    // Maintain position
    return currentPosition
  }
}

export const EMATrend: Strategy = {
  id: 'ema_trend',
  name: 'EMA Trend',
  description: 'Goes LONG when price closes above EMA. Goes SHORT when price closes below EMA.',
  defaultParameters: {
    period: 20,
  },
  validateParameters: (params) => {
    if (params.period <= 0) return "Period must be greater than 0"
    return null
  },
  generateSignal: ({ index, data, parameters, currentPosition }): Signal => {
    const { period } = parameters
    
    if (index < period) return 0

    const prices = getPrices(data.slice(0, index + 1))
    const ema = calculateEMA(prices, period)
    const currentEma = ema[ema.length - 1]
    const currentPrice = prices[prices.length - 1]

    if (currentPrice > currentEma) return 1
    if (currentPrice < currentEma) return -1
    
    return currentPosition
  }
}

export const Momentum: Strategy = {
  id: 'momentum',
  name: 'Momentum',
  description: 'Goes LONG if ROC (Rate of Change) is positive. Goes SHORT if ROC is negative.',
  defaultParameters: {
    period: 14,
  },
  validateParameters: (params) => {
    if (params.period <= 0) return "Period must be greater than 0"
    return null
  },
  generateSignal: ({ index, data, parameters, currentPosition }): Signal => {
    const { period } = parameters
    if (index < period) return 0

    const currentPrice = data[index].close
    const pastPrice = data[index - period].close
    const roc = ((currentPrice - pastPrice) / pastPrice) * 100

    if (roc > 0) return 1
    if (roc < 0) return -1

    return currentPosition
  }
}

export const MeanReversion: Strategy = {
  id: 'mean_reversion',
  name: 'Mean Reversion (Bollinger Bands)',
  description: 'Goes LONG when price crosses below lower band. Goes SHORT when price crosses above upper band.',
  defaultParameters: {
    period: 20,
    stdDev: 2,
  },
  validateParameters: (params) => {
    if (params.period <= 1) return "Period must be greater than 1 for Standard Deviation"
    if (params.stdDev <= 0) return "Standard Deviation multiplier must be positive"
    return null
  },
  generateSignal: ({ index, data, parameters, currentPosition }): Signal => {
    const { period, stdDev } = parameters
    if (index < period) return 0

    const prices = getPrices(data.slice(0, index + 1))
    const sma = calculateSMA(prices, period)
    const currentSma = sma[sma.length - 1]
    
    // Calculate standard deviation of last 'period' prices
    const recentPrices = prices.slice(-period)
    const mean = recentPrices.reduce((a, b) => a + b, 0) / period
    const variance = recentPrices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period
    const currentStdDev = Math.sqrt(variance)

    const upperBand = currentSma + (currentStdDev * stdDev)
    const lowerBand = currentSma - (currentStdDev * stdDev)
    const currentPrice = prices[prices.length - 1]

    if (currentPrice < lowerBand) return 1 // Oversold -> Buy
    if (currentPrice > upperBand) return -1 // Overbought -> Sell
    
    // Exit position if reverting to mean
    if (currentPosition === 1 && currentPrice >= currentSma) return 0
    if (currentPosition === -1 && currentPrice <= currentSma) return 0

    return currentPosition
  }
}

export const STRATEGIES = [SMACrossover, EMATrend, Momentum, MeanReversion]
