import type { OHLCV } from '@/hooks/useMarketData'

export interface IMarketDataProvider {
  /**
   * Fetch historical OHLCV data for an asset over a date range.
   */
  getHistoricalData(symbol: string, startDate?: string, endDate?: string): Promise<OHLCV[]>

  /**
   * Normalize and validate raw data to ensure chronological ordering,
   * no missing required fields, and removal of invalid/NaN values.
   */
  normalize(data: any[]): OHLCV[]

  /**
   * Validate that the asset is supported.
   */
  validateSymbol(symbol: string): boolean
}
