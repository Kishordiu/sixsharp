/**
 * Simple Moving Average (SMA)
 * @param data Array of prices
 * @param period Lookback period
 * @returns Array of SMA values. The first (period - 1) values will be NaN.
 */
export function calculateSMA(data: number[], period: number): number[] {
  if (data.length < period) return new Array(data.length).fill(NaN)

  const result: number[] = new Array(data.length).fill(NaN)
  let sum = 0

  for (let i = 0; i < data.length; i++) {
    sum += data[i]
    if (i >= period) {
      sum -= data[i - period]
    }
    if (i >= period - 1) {
      result[i] = sum / period
    }
  }

  return result
}

/**
 * Exponential Moving Average (EMA)
 * @param data Array of prices
 * @param period Lookback period
 * @returns Array of EMA values. The first (period - 1) values will be NaN.
 */
export function calculateEMA(data: number[], period: number): number[] {
  if (data.length < period) return new Array(data.length).fill(NaN)

  const result: number[] = new Array(data.length).fill(NaN)
  const multiplier = 2 / (period + 1)
  
  // Calculate initial SMA for the first EMA value
  let initialSma = 0
  for (let i = 0; i < period; i++) {
    initialSma += data[i]
  }
  initialSma /= period
  
  result[period - 1] = initialSma

  for (let i = period; i < data.length; i++) {
    result[i] = (data[i] - result[i - 1]) * multiplier + result[i - 1]
  }

  return result
}

/**
 * Relative Strength Index (RSI)
 * @param data Array of prices
 * @param period Lookback period
 */
export function calculateRSI(data: number[], period: number = 14): number[] {
  if (data.length <= period) return new Array(data.length).fill(NaN)

  const result: number[] = new Array(data.length).fill(NaN)
  
  let avgGain = 0
  let avgLoss = 0

  // Initial calculation
  for (let i = 1; i <= period; i++) {
    const diff = data[i] - data[i - 1]
    if (diff > 0) avgGain += diff
    else avgLoss += Math.abs(diff)
  }

  avgGain /= period
  avgLoss /= period

  const rs = avgGain / avgLoss
  result[period] = avgLoss === 0 ? 100 : 100 - (100 / (1 + rs))

  // Smoothed calculation for rest of array
  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i] - data[i - 1]
    const currentGain = diff > 0 ? diff : 0
    const currentLoss = diff < 0 ? Math.abs(diff) : 0

    avgGain = ((avgGain * (period - 1)) + currentGain) / period
    avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period

    if (avgLoss === 0) {
      result[i] = 100
    } else {
      const smoothedRs = avgGain / avgLoss
      result[i] = 100 - (100 / (1 + smoothedRs))
    }
  }

  return result
}

/**
 * Bollinger Bands
 */
export interface BollingerBandsResult {
  upper: number[]
  lower: number[]
  middle: number[]
}

export function calculateBollingerBands(data: number[], period: number = 20, stdDev: number = 2): BollingerBandsResult {
  const result: BollingerBandsResult = {
    upper: new Array(data.length).fill(NaN),
    lower: new Array(data.length).fill(NaN),
    middle: new Array(data.length).fill(NaN),
  }

  if (data.length < period) return result

  const sma = calculateSMA(data, period)
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1)
    const mean = sma[i]
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period
    const dev = Math.sqrt(variance)

    result.middle[i] = mean
    result.upper[i] = mean + (dev * stdDev)
    result.lower[i] = mean - (dev * stdDev)
  }

  return result
}

/**
 * MACD (Moving Average Convergence Divergence)
 */
export interface MACDResult {
  macd: number[]
  signal: number[]
  histogram: number[]
}

export function calculateMACD(data: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): MACDResult {
  const result: MACDResult = {
    macd: new Array(data.length).fill(NaN),
    signal: new Array(data.length).fill(NaN),
    histogram: new Array(data.length).fill(NaN)
  }

  if (data.length < slowPeriod) return result

  const fastEma = calculateEMA(data, fastPeriod)
  const slowEma = calculateEMA(data, slowPeriod)

  const macdLine = new Array(data.length).fill(NaN)
  
  // Calculate MACD Line
  for (let i = slowPeriod - 1; i < data.length; i++) {
    macdLine[i] = fastEma[i] - slowEma[i]
  }

  // Calculate Signal Line (EMA of MACD Line)
  // We need to pass only the valid slice of MACD line to EMA calculator
  const validMacd = macdLine.slice(slowPeriod - 1)
  const signalLineValid = calculateEMA(validMacd, signalPeriod)

  // Re-map back
  for (let i = 0; i < signalLineValid.length; i++) {
    const targetIdx = i + slowPeriod - 1
    result.macd[targetIdx] = macdLine[targetIdx]
    result.signal[targetIdx] = signalLineValid[i]
    
    if (!Number.isNaN(result.macd[targetIdx]) && !Number.isNaN(result.signal[targetIdx])) {
      result.histogram[targetIdx] = result.macd[targetIdx] - result.signal[targetIdx]
    }
  }

  return result
}
