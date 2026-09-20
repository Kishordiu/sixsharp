/**
 * Calculates daily percentage returns from an array of prices
 * @param prices Array of prices (e.g., closing prices)
 */
export function calculateReturns(prices: number[]): number[] {
  if (prices.length < 2) return new Array(prices.length).fill(0)
  
  const returns = [0] // First period has 0 return
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
  }
  return returns
}

/**
 * Calculates cumulative returns from daily returns
 * @param returns Array of daily returns
 */
export function calculateCumulativeReturns(returns: number[]): number[] {
  let cumulative = 1
  return returns.map(ret => {
    cumulative *= (1 + ret)
    return cumulative - 1
  })
}

/**
 * Calculates Annualized Volatility
 * @param returns Array of daily returns
 * @param tradingDays Number of trading days in a year (default 252)
 */
export function calculateVolatility(returns: number[], tradingDays: number = 252): number {
  if (returns.length < 2) return 0
  
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length
  const squaredDiffs = returns.map(val => Math.pow(val - mean, 2))
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / (returns.length - 1)
  
  const dailyVolatility = Math.sqrt(variance)
  return dailyVolatility * Math.sqrt(tradingDays)
}

/**
 * Calculates Annualized Sharpe Ratio
 * @param returns Array of daily returns
 * @param riskFreeRate Annual risk free rate (default 0.02 = 2%)
 * @param tradingDays Number of trading days in a year (default 252)
 */
export function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.02, tradingDays: number = 252): number {
  if (returns.length < 2) return 0

  const annualizedReturn = (returns.reduce((sum, val) => sum + val, 0) / returns.length) * tradingDays
  const volatility = calculateVolatility(returns, tradingDays)
  
  if (volatility === 0) return 0
  
  return (annualizedReturn - riskFreeRate) / volatility
}

/**
 * Calculates Maximum Drawdown
 * @param prices Array of prices or cumulative equity values
 * @returns Max drawdown as a positive decimal (e.g., 0.15 for 15% drawdown)
 */
export function calculateMaxDrawdown(prices: number[]): number {
  if (prices.length < 2) return 0

  let maxPrice = prices[0]
  let maxDrawdown = 0

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > maxPrice) {
      maxPrice = prices[i]
    }
    const drawdown = (maxPrice - prices[i]) / maxPrice
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }

  return maxDrawdown
}

/**
 * Calculates Pearson Correlation Coefficient between two return series
 * @param returnsA First array of returns
 * @param returnsB Second array of returns
 */
export function calculateCorrelation(returnsA: number[], returnsB: number[]): number {
  if (returnsA.length !== returnsB.length || returnsA.length < 2) return 0

  const n = returnsA.length
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0

  for (let i = 0; i < n; i++) {
    const x = returnsA[i]
    const y = returnsB[i]
    sumX += x
    sumY += y
    sumXY += x * y
    sumX2 += x * x
    sumY2 += y * y
  }

  const numerator = (n * sumXY) - (sumX * sumY)
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

  return denominator === 0 ? 0 : numerator / denominator
}
