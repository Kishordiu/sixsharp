import { describe, it, expect } from 'vitest'
import { calculateSMA, calculateEMA, calculateRSI, calculateBollingerBands, calculateMACD } from './indicators'
import { calculateReturns, calculateCumulativeReturns, calculateVolatility, calculateSharpeRatio, calculateMaxDrawdown, calculateCorrelation } from './metrics'

describe('Quantitative Indicators', () => {
  it('calculates SMA correctly', () => {
    const data = [1, 2, 3, 4, 5]
    const sma = calculateSMA(data, 3)
    
    expect(Number.isNaN(sma[0])).toBe(true)
    expect(Number.isNaN(sma[1])).toBe(true)
    expect(sma[2]).toBe(2) // (1+2+3)/3
    expect(sma[3]).toBe(3) // (2+3+4)/3
    expect(sma[4]).toBe(4) // (3+4+5)/3
  })

  it('calculates EMA correctly', () => {
    const data = [10, 10, 10, 10, 10]
    const ema = calculateEMA(data, 3)
    
    expect(Number.isNaN(ema[0])).toBe(true)
    expect(Number.isNaN(ema[1])).toBe(true)
    expect(ema[2]).toBe(10)
    expect(ema[3]).toBe(10)
  })

  it('calculates RSI correctly (known fixture)', () => {
    // 15 days of dummy data for a 14-day RSI
    // Price goes up steadily by 1 every day
    const data = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    const rsi = calculateRSI(data, 14)
    
    // First 13 values should be NaN
    expect(Number.isNaN(rsi[13])).toBe(true)
    
    // On the 14th day (index 14), average gain = 1, average loss = 0.
    // RSI should be exactly 100 because there are no losses.
    expect(rsi[14]).toBe(100)
  })

  it('calculates Bollinger Bands correctly', () => {
    // 4 days of data for a 3-day bollinger band
    const data = [10, 12, 14, 12]
    const bb = calculateBollingerBands(data, 3, 2)
    
    // Middle band at index 2 (days 0,1,2: 10,12,14) -> SMA = 12
    expect(bb.middle[2]).toBe(12)
    // Variance of [10, 12, 14] around 12: ((10-12)^2 + (12-12)^2 + (14-12)^2) / 3 = (4 + 0 + 4)/3 = 8/3 = 2.666...
    // StdDev = sqrt(8/3) ~= 1.63299
    // Upper = 12 + 2 * 1.63299 = 15.26598
    // Lower = 12 - 2 * 1.63299 = 8.73401
    expect(bb.upper[2]).toBeCloseTo(15.26598, 4)
    expect(bb.lower[2]).toBeCloseTo(8.73401, 4)
    
    // Index 3 (days 1,2,3: 12,14,12) -> SMA = 12.666...
    expect(bb.middle[3]).toBeCloseTo(12.6667, 4)
  })

  it('calculates MACD correctly', () => {
    // Generate some flat data just to ensure it computes without crashing
    const data = new Array(30).fill(100)
    const macd = calculateMACD(data, 12, 26, 9)
    
    // Slow period is 26, so MACD line starts at index 25
    expect(Number.isNaN(macd.macd[24])).toBe(true)
    // For completely flat data, MACD should be 0, signal 0, histogram 0
    expect(macd.macd[25]).toBeCloseTo(0)
    
    // The signal line takes 9 periods of the MACD line, so it should start at index 25 + 9 - 1 = 33
    // Wait, since we mapped validMacd back, if data is only 30 elements, signal won't be calculated until later?
    // Actually, calculateEMA returns NaN for the first `period-1` values of the input.
    // The input is validMacd, which has length 30 - 25 = 5.
    // Since signalPeriod = 9, and validMacd length is 5, calculateEMA will just return NaNs.
    expect(Number.isNaN(macd.signal[29])).toBe(true)
  })
})

describe('Quantitative Metrics', () => {
  it('calculates daily returns correctly', () => {
    const prices = [100, 105, 102.9]
    const returns = calculateReturns(prices)
    
    expect(returns[0]).toBe(0)
    expect(returns[1]).toBeCloseTo(0.05) // 5% gain
    expect(returns[2]).toBeCloseTo(-0.02) // 2% loss
  })

  it('calculates cumulative returns correctly', () => {
    const returns = [0, 0.10, -0.05]
    const cum = calculateCumulativeReturns(returns)
    
    expect(cum[0]).toBe(0)
    expect(cum[1]).toBeCloseTo(0.10)
    expect(cum[2]).toBeCloseTo(0.045) // 1.10 * 0.95 = 1.045
  })

  it('calculates Annualized Volatility correctly', () => {
    // Generate simple returns
    const returns = [0.01, -0.01, 0.02, -0.02]
    
    // Mean = 0
    // Squared diffs = [0.0001, 0.0001, 0.0004, 0.0004]
    // Sum squared diffs = 0.001
    // Variance (sample, n-1=3) = 0.001 / 3 = 0.0003333...
    // Daily volatility (stddev) = sqrt(0.0003333) = 0.018257
    // Annualized Volatility (default 252 days) = 0.018257 * sqrt(252) = 0.2898
    
    const vol = calculateVolatility(returns)
    expect(vol).toBeCloseTo(0.2898, 4)
  })

  it('calculates Sharpe Ratio correctly', () => {
    const returns = [0.01, 0.02, 0.01, 0.02]
    // Mean = 0.015
    // Annualized return (252 days) = 0.015 * 252 = 3.78
    // Variance (n-1=3): sq diffs = 4 * 0.000025 = 0.0001
    // Variance = 0.0001 / 3 = 0.0000333...
    // Daily vol = 0.00577...
    // Ann vol = 0.00577 * sqrt(252) = 0.09165...
    // Sharpe (rf=0.02) = (3.78 - 0.02) / 0.09165 = 3.76 / 0.09165 = 41.025
    
    const sharpe = calculateSharpeRatio(returns)
    expect(sharpe).toBeCloseTo(41.025, 2)
  })

  it('calculates max drawdown correctly', () => {
    const prices = [100, 120, 90, 110, 80, 150]
    const mdd = calculateMaxDrawdown(prices)
    // Max peak is 120, drops to 80 -> (120 - 80) / 120 = 40 / 120 = 33.33%
    expect(mdd).toBeCloseTo(0.3333, 4)
  })

  it('calculates correlation correctly', () => {
    const a = [0.01, -0.02, 0.03, -0.01]
    const b = [0.01, -0.02, 0.03, -0.01]
    const c = [-0.01, 0.02, -0.03, 0.01]
    
    expect(calculateCorrelation(a, b)).toBeCloseTo(1)
    expect(calculateCorrelation(a, c)).toBeCloseTo(-1)
  })
})
