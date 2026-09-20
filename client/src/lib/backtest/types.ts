import type { OHLCV } from '@/hooks/useMarketData'

export type Signal = 1 | 0 | -1 // 1: LONG, 0: FLAT, -1: SHORT

export interface StrategyParameters {
  [key: string]: number
}

export interface StrategyContext {
  index: number
  data: OHLCV[]
  parameters: StrategyParameters
  currentPosition: Signal
}

export interface Strategy {
  id: string
  name: string
  description: string
  defaultParameters: StrategyParameters
  validateParameters: (parameters: StrategyParameters) => string | null
  generateSignal: (context: StrategyContext) => Signal
}
