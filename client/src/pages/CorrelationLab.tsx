import { useState, useEffect } from 'react'
import { Activity, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { calculateReturns, calculateCorrelation } from '@/lib/quant/metrics'

import { useTranslation } from 'react-i18next'

// We will fetch multiple assets to build a correlation matrix
const ASSETS = ['BTC-USD', 'ETH-USD', 'SPY', 'QQQ', 'GC=F']

export default function CorrelationLab() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [matrix, setMatrix] = useState<number[][]>([])
  const [error, setError] = useState<string | null>(null)
  const [windowSize, setWindowSize] = useState<number | 'all'>('all')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const fetchAndCalculate = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch historical data for all assets in parallel
      const fetchPromises = ASSETS.map(symbol =>
        fetch(`${API_URL}/api/market/historical/${symbol}`)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch ${symbol}`)
            return res.json()
          })
      )

      const results = await Promise.all(fetchPromises)
      
      // Calculate daily returns for each asset
      const assetReturns = results.map(res => {
        let prices = res.data.map((d: any) => d.close)
        
        // Apply rolling window slice if selected
        if (windowSize !== 'all') {
          prices = prices.slice(-windowSize)
        }
        
        return calculateReturns(prices)
      })

      // We must align the lengths of returns to compute correlation properly.
      // For simplicity in this demo, we assume the backend returns identical length arrays
      // due to Yahoo Finance's standard 5-year lookback alignment. 
      // In production, we'd align arrays by exact date matching.
      
      const n = ASSETS.length
      const corrMatrix = Array(n).fill(0).map(() => Array(n).fill(0))

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i === j) {
            corrMatrix[i][j] = 1
          } else {
            corrMatrix[i][j] = calculateCorrelation(assetReturns[i], assetReturns[j])
          }
        }
      }

      setMatrix(corrMatrix)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAndCalculate()
  }, [windowSize])

  const getColorForCorrelation = (val: number) => {
    if (val === 1) return 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'
    if (val > 0.7) return 'bg-[var(--color-accent-green)]/40 text-white'
    if (val > 0.3) return 'bg-[var(--color-accent-green)]/20 text-white'
    if (val < -0.7) return 'bg-[var(--color-accent-red)]/40 text-white'
    if (val < -0.3) return 'bg-[var(--color-accent-red)]/20 text-white'
    return 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]'
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-4">
            <div className="p-3 bg-[var(--color-accent-purple)]/10 rounded-xl border border-[var(--color-accent-purple)]/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <Activity className="text-[var(--color-accent-purple)] w-7 h-7" />
            </div>
            {t('correlation.title')}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-light">
            {t('correlation.subtitle')}
          </p>
        </motion.div>
        <div className="flex items-center gap-4">
          <select 
            value={windowSize} 
            onChange={(e) => setWindowSize(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)]"
          >
            <option value="all">All-Time (5 Years)</option>
            <option value="20">20-Day Rolling</option>
            <option value="60">60-Day Rolling</option>
            <option value="90">90-Day Rolling</option>
          </select>
          <Button onClick={fetchAndCalculate} isLoading={loading} variant="secondary">
            <RefreshCw size={16} className="mr-2" /> Recalculate
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <Card variant="glass" className="overflow-hidden">
        <CardHeader>
          <CardTitle>
            {windowSize === 'all' ? '5-Year' : `${windowSize}-Day`} Daily Returns Correlation Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          {matrix.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-[var(--color-text-secondary)] bg-[var(--color-bg-elevated)]/30 rounded-lg border border-[var(--color-border)]/50 backdrop-blur-sm">
              {loading ? 'Calculating matrix...' : 'No data available.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-3"></th>
                    {ASSETS.map(a => (
                      <th key={a} className="p-3 font-medium text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                        {a}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ASSETS.map((asset, i) => (
                    <tr key={asset}>
                      <td className="p-3 font-medium text-[var(--color-text-secondary)] border-r border-[var(--color-border)] text-left">
                        {asset}
                      </td>
                      {ASSETS.map((_, j) => {
                        const val = matrix[i][j]
                        return (
                          <td key={j} className="p-1">
                            <div className={`w-full h-12 flex items-center justify-center rounded font-mono text-sm transition-colors ${getColorForCorrelation(val)}`}>
                              {val.toFixed(2)}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What is Pearson Correlation?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Pearson correlation measures the linear correlation between two variables (asset returns), ranging from +1 to -1.
            A value of +1 implies perfect positive correlation, while -1 implies perfect negative correlation. 0 implies no linear correlation.
          </CardContent>
        </Card>
        
        <Card variant="glass" className="w-full border border-[var(--color-border)] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-accent-purple)]/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
          <CardHeader className="border-b border-[var(--color-border)]/50 pb-4 relative z-10">
            <CardTitle className="text-xl font-semibold tracking-wide">Portfolio Construction</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 relative z-10 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Modern Portfolio Theory suggests combining assets with low or negative correlations to maximize returns for a given level of risk (diversification). 
            Look for assets in the gray or red zones to diversify a long-only portfolio.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
