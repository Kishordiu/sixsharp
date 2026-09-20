import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useMarketData } from '@/hooks/useMarketData'
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'

import { useTranslation } from 'react-i18next'

// Simple helper to calculate standard deviation
const standardDeviation = (arr: number[]) => {
  const n = arr.length
  if (n === 0) return 0
  const mean = arr.reduce((a, b) => a + b, 0) / n
  return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n)
}

export default function RegimeAnalysis() {
  const { t } = useTranslation()
  const [symbol, setSymbol] = useState('BTC-USD')
  const { data: marketData, loading, error } = useMarketData(symbol)
  
  const [lookbackWindow, setLookbackWindow] = useState(20)

  // Calculate Market Regimes based on Returns and Volatility
  const regimeData = useMemo(() => {
    if (!marketData || marketData.length < lookbackWindow) return []

    const returns = marketData.map((d, i) => {
      if (i === 0) return 0
      return (d.close - marketData[i - 1].close) / marketData[i - 1].close
    })

    const regimes = []
    
    // We start from the lookback window
    for (let i = lookbackWindow; i < marketData.length; i++) {
      const windowReturns = returns.slice(i - lookbackWindow + 1, i + 1)
      const meanReturn = windowReturns.reduce((a, b) => a + b, 0) / lookbackWindow
      const volatility = standardDeviation(windowReturns) * Math.sqrt(252) // Annualized
      
      let classification = 'Neutral'
      let color = 'text-[var(--color-text-secondary)]'
      let icon = Minus

      // Simple Regime Classification Logic
      if (meanReturn > 0.001 && volatility < 0.4) {
        classification = 'Bull / Low Vol'
        color = 'text-green-400'
        icon = TrendingUp
      } else if (meanReturn > 0.001 && volatility >= 0.4) {
        classification = 'Bull / High Vol'
        color = 'text-green-500'
        icon = TrendingUp
      } else if (meanReturn < -0.001 && volatility < 0.4) {
        classification = 'Bear / Low Vol'
        color = 'text-red-400'
        icon = TrendingDown
      } else if (meanReturn < -0.001 && volatility >= 0.4) {
        classification = 'Bear / High Vol'
        color = 'text-red-500'
        icon = TrendingDown
      } else if (volatility > 0.6) {
        classification = 'High Volatility'
        color = 'text-yellow-500'
        icon = Activity
      }

      regimes.push({
        date: marketData[i].time,
        close: marketData[i].close,
        meanReturn: meanReturn,
        volatility: volatility,
        classification,
        color,
        icon
      })
    }
    
    return regimes
  }, [marketData, lookbackWindow])

  const latestRegime = regimeData[regimeData.length - 1]

  return (
    <div className="flex flex-col gap-6 w-full mx-auto max-w-[1400px]">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-4">
            <div className="p-3 bg-[var(--color-accent-purple)]/10 rounded-xl border border-[var(--color-accent-purple)]/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <Activity className="text-[var(--color-accent-purple)] w-7 h-7" />
            </div>
            {t('regime.title')}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-light">
            {t('regime.subtitle')}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="lg:col-span-1 border border-[var(--color-border)] shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-purple)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative z-10 border-b border-[var(--color-border)]/50 pb-4">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold tracking-wide">
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Asset Symbol</label>
              <Input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Lookback Window (Days)</label>
              <Input type="number" value={lookbackWindow} onChange={(e) => setLookbackWindow(Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Methodology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            <p><strong>Bull</strong>: Mean daily return &gt; 0.1%</p>
            <p><strong>Bear</strong>: Mean daily return &lt; -0.1%</p>
            <p><strong>Neutral</strong>: -0.1% &le; Return &le; 0.1%</p>
            <p><strong>Low Vol</strong>: Annualized Volatility &lt; 40%</p>
            <p><strong>High Vol</strong>: Annualized Volatility &ge; 40%</p>
            <p><strong>Extreme Vol</strong>: Annualized Volatility &gt; 60%</p>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 flex flex-col gap-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-red-500 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
             <div className="h-64 flex items-center justify-center bg-[var(--color-bg-card)]/50 backdrop-blur-sm rounded-lg border border-[var(--color-border)]">
               <div className="w-8 h-8 border-2 border-[var(--color-accent-purple)] border-t-transparent rounded-full animate-spin" />
             </div>
          ) : latestRegime ? (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <Card variant="glass" className="relative overflow-hidden group border-t-0 shadow-lg">
                  <div className={`absolute top-0 left-0 w-full h-1 ${latestRegime.classification.includes('Bull') ? 'bg-green-500' : latestRegime.classification.includes('Bear') ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <CardContent className="p-6">
                    <p className="text-sm text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Current Regime</p>
                    <div className="flex items-center gap-3">
                      <latestRegime.icon className={latestRegime.color} size={32} />
                      <h3 className={`text-2xl font-bold ${latestRegime.color}`}>{latestRegime.classification}</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="glass" className="border-t-0 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent-purple)]" />
                  <CardContent className="p-6">
                    <p className="text-sm text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Annualized Volatility</p>
                    <h3 className="text-3xl font-bold text-[var(--color-text-primary)] font-mono">{(latestRegime.volatility * 100).toFixed(1)}%</h3>
                  </CardContent>
                </Card>

                <Card variant="glass" className="border-t-0 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent-cyan)]" />
                  <CardContent className="p-6">
                    <p className="text-sm text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Mean Return</p>
                    <h3 className={`text-3xl font-bold font-mono ${latestRegime.meanReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(latestRegime.meanReturn * 100).toFixed(2)}%
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>

              <Card className="shadow-xl backdrop-blur-md bg-[var(--color-bg-secondary)]/80">
                <CardHeader>
                  <CardTitle>Recent History</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border)]/50">
                        <th className="p-3 text-sm text-[var(--color-text-secondary)] font-medium">Date</th>
                        <th className="p-3 text-sm text-[var(--color-text-secondary)] font-medium">Close</th>
                        <th className="p-3 text-sm text-[var(--color-text-secondary)] font-medium">Volatility (Ann.)</th>
                        <th className="p-3 text-sm text-[var(--color-text-secondary)] font-medium">Regime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]/30">
                      {regimeData.slice(-10).reverse().map((day, idx) => (
                        <motion.tr 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: idx * 0.05 }}
                          key={idx} 
                          className="hover:bg-[var(--color-bg-elevated)]/50 transition-colors"
                        >
                          <td className="p-3 text-sm text-[var(--color-text-secondary)] font-mono">{day.date}</td>
                          <td className="p-3 text-sm font-mono text-[var(--color-text-primary)]">${day.close.toFixed(2)}</td>
                          <td className="p-3 text-sm font-mono text-[var(--color-text-primary)]">{(day.volatility * 100).toFixed(1)}%</td>
                          <td className="p-3 text-sm">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-black/30 border border-current ${day.color}`}>
                              <day.icon size={12} /> {day.classification}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="p-12 text-center text-[var(--color-text-secondary)]">
              Not enough data for the selected lookback window.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
