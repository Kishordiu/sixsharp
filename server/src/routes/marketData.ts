import { Router } from 'express'
import { YahooFinanceProvider } from '../services/yahooFinance'

const router = Router()

/**
 * GET /api/market/historical/:symbol
 * Fetches historical OHLCV data for a given symbol
 * Query params: startDate (optional), endDate (optional)
 */
router.get('/historical/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    const { startDate, endDate } = req.query

    if (!symbol) {
      return res.status(400).json({ ok: false, error: { code: 'INVALID_SYMBOL', message: 'Symbol is required', retryable: false } })
    }

    const data = await YahooFinanceProvider.getHistoricalData(
      symbol,
      startDate as string | undefined,
      endDate as string | undefined
    )

    res.json({ ok: true, symbol, data })
  } catch (error: any) {
    console.error(`Route Error /historical/${req.params.symbol}:`, error.message)
    res.status(503).json({
      ok: false,
      error: {
        code: 'MARKET_DATA_UNAVAILABLE',
        message: 'Historical data could not be fetched.',
        retryable: true
      }
    })
  }
})

/**
 * GET /api/market/quote/:symbol
 * Fetches latest quote for a given symbol
 */
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    if (!symbol) {
      return res.status(400).json({ ok: false, error: { code: 'INVALID_SYMBOL', message: 'Symbol is required', retryable: false } })
    }

    const quote = await YahooFinanceProvider.getQuote(symbol)
    res.json({ ok: true, ...quote })
  } catch (error: any) {
    res.status(503).json({
      ok: false,
      error: {
        code: 'QUOTE_UNAVAILABLE',
        message: 'Latest quote could not be fetched.',
        retryable: true
      }
    })
  }
})

export default router
