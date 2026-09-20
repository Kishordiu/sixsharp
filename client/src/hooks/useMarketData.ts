import { useState, useEffect } from 'react'

export interface OHLCV {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface Quote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function useMarketData(symbol: string, startDate?: string, endDate?: string) {
  const [data, setData] = useState<OHLCV[]>([])
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      if (!symbol) return

      setLoading(true)
      setError(null)

      try {
        // Fetch historical data
        let historyUrl = `${API_URL}/api/market/historical/${symbol}`
        const params = new URLSearchParams()
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
        if (params.toString()) historyUrl += `?${params.toString()}`

        const [historyRes, quoteRes] = await Promise.all([
          fetch(historyUrl),
          fetch(`${API_URL}/api/market/quote/${symbol}`)
        ])

        const historyJson = await historyRes.json()
        const quoteJson = await quoteRes.json()

        if (!historyJson.ok) throw new Error(historyJson.error?.message || 'Failed to fetch historical data')
        if (!quoteJson.ok) throw new Error(quoteJson.error?.message || 'Failed to fetch quote')

        if (isMounted) {
          setData(historyJson.data || [])
          setQuote(quoteJson)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error loading market data')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [symbol, startDate, endDate])

  return { data, quote, loading, error }
}
