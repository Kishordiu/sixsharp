import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useMarketData } from '@/hooks/useMarketData'
import { AlertTriangle, Layers, Play, Info } from 'lucide-react'
import { STRATEGIES } from '@/lib/backtest/strategies'
import { BacktestEngine } from '@/lib/backtest/engine'
import { useTranslation } from 'react-i18next'
import { useMode } from '@/app/providers/ModeProvider'
import { motion } from 'framer-motion'

export default function RobustnessLab() {
  const { t } = useTranslation()
  const { mode } = useMode()
  const [symbol, setSymbol] = useState('BTC-USD')
  const { data: marketData, loading: marketLoading, error: marketError } = useMarketData(symbol)
  
  const [selectedStrategyId, setSelectedStrategyId] = useState(STRATEGIES[0].id)
  const activeStrategyDef = useMemo(() => STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[0], [selectedStrategyId])
  
  // Sweep configuration for two parameters
  const [param1, setParam1] = useState({ key: 'fastPeriod', min: 5, max: 20, step: 5 })
  const [param2, setParam2] = useState({ key: 'slowPeriod', min: 25, max: 50, step: 5 })
  
  const [isSimulating, setIsSimulating] = useState(false)
  const [sweepResults, setSweepResults] = useState<any[]>([])

  const runSweep = async () => {
    if (!marketData || marketData.length === 0) return
    setIsSimulating(true)
    setSweepResults([])
    
    if (param1.step === 0 || param2.step === 0) {
      alert("Step size cannot be 0.")
      setIsSimulating(false)
      return
    }

    if ((param1.step > 0 && param1.min > param1.max) || (param1.step < 0 && param1.min < param1.max)) {
      alert("Invalid Parameter 1 bounds and step.")
      setIsSimulating(false)
      return
    }

    if ((param2.step > 0 && param2.min > param2.max) || (param2.step < 0 && param2.min < param2.max)) {
      alert("Invalid Parameter 2 bounds and step.")
      setIsSimulating(false)
      return
    }

    const results: any[] = []
    
    // Create combinations
    const combinations: Array<Record<string, number>> = []
    for (let p1 = param1.min; p1 <= param1.max; p1 += param1.step) {
      for (let p2 = param2.min; p2 <= param2.max; p2 += param2.step) {
        combinations.push({ p1, p2 })
      }
    }

    const batchSize = 10 // process 10 combinations per animation frame
    
    const processBatch = async (startIndex: number) => {
      const endIndex = Math.min(startIndex + batchSize, combinations.length)
      
      for (let i = startIndex; i < endIndex; i++) {
        const { p1, p2 } = combinations[i]
        const parameters = { ...activeStrategyDef.defaultParameters, [param1.key]: p1, [param2.key]: p2 }
        
        if (activeStrategyDef.validateParameters(parameters)) {
          continue 
        }

        const engine = new BacktestEngine(marketData, activeStrategyDef, parameters, {
          initialCapital: 100000,
          transactionCostPct: 0.001,
          positionSizingPct: 1.0
        })
        
        const result = engine.run()
        results.push({
          p1,
          p2,
          return: result.summary.totalReturn,
          sharpe: result.summary.sharpeRatio
        })
      }

      setSweepResults([...results]) // progressively update UI

      if (endIndex < combinations.length) {
        // Yield to main thread
        await new Promise(resolve => requestAnimationFrame(resolve))
        await processBatch(endIndex)
      }
    }

    try {
      await processBatch(0)
    } catch (e) {
      console.error(e)
      alert(t('common.error'))
    } finally {
      setIsSimulating(false)
    }
  }

  // Get min/max for heat mapping colors
  const maxReturn = Math.max(...sweepResults.map(r => r.return))
  const minReturn = Math.min(...sweepResults.map(r => r.return))
  
  const getColor = (val: number) => {
    // Normalize between 0 and 1
    const normalized = (val - minReturn) / (maxReturn - minReturn || 1)
    if (val < 0) {
      // Red scale for negative
      return `rgba(239, 68, 68, ${Math.max(0.2, 1 - normalized)})`
    } else {
      // Green scale for positive
      return `rgba(34, 197, 94, ${Math.max(0.2, normalized)})`
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full mx-auto max-w-[1400px] relative z-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-4">
            <div className="p-3 bg-[var(--color-accent-blue)]/10 rounded-xl border border-[var(--color-accent-blue)]/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Layers className="text-[var(--color-accent-blue)] w-7 h-7" />
            </div>
            {t('robustness.title')}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-light">
            {t('robustness.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* AI Explanation Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="liquid-card border-[var(--color-accent-purple)]/50">
              <CardHeader className="pb-3 border-b border-white/10">
                <CardTitle className="text-sm tracking-wider uppercase text-[var(--color-accent-purple)] flex items-center gap-2">
                  <Info size={16} />
                  {mode === 'pro' ? 'Pro Execution' : 'Concept Guide'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {mode === 'pro' ? t('robustness.proExplain') : t('robustness.beginnerExplain')}
              </CardContent>
            </Card>
          </motion.div>

          <Card className="liquid-card border border-[var(--color-border)] shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-blue)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10 border-b border-[var(--color-border)]/50 pb-4">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold tracking-wide">
                {t('robustness.sweepConfig')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10 pt-6">
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">{t('robustness.assetSymbol')}</label>
                <Input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} />
              </div>
              
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">{t('robustness.strategy')}</label>
                <select 
                  className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none"
                  value={selectedStrategyId}
                  onChange={(e) => setSelectedStrategyId(e.target.value)}
                >
                  {STRATEGIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="border-t border-[var(--color-border)] pt-4 mt-2">
                <label className="text-xs font-medium text-[var(--color-accent-blue)] mb-3 block">{t('robustness.param1')}</label>
                <select className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm mb-2" value={param1.key} onChange={e => setParam1({...param1, key: e.target.value})}>
                  {Object.keys(activeStrategyDef.defaultParameters).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Min" value={param1.min} onChange={e => setParam1({...param1, min: Number(e.target.value)})} />
                  <Input type="number" placeholder="Max" value={param1.max} onChange={e => setParam1({...param1, max: Number(e.target.value)})} />
                  <Input type="number" placeholder="Step" value={param1.step} onChange={e => setParam1({...param1, step: Number(e.target.value)})} />
                </div>
              </div>

              <div className="border-t border-[var(--color-border)] pt-4 mt-2">
                <label className="text-xs font-medium text-[var(--color-accent-purple)] mb-3 block">{t('robustness.param2')}</label>
                <select className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm mb-2" value={param2.key} onChange={e => setParam2({...param2, key: e.target.value})}>
                  {Object.keys(activeStrategyDef.defaultParameters).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Min" value={param2.min} onChange={e => setParam2({...param2, min: Number(e.target.value)})} />
                  <Input type="number" placeholder="Max" value={param2.max} onChange={e => setParam2({...param2, max: Number(e.target.value)})} />
                  <Input type="number" placeholder="Step" value={param2.step} onChange={e => setParam2({...param2, step: Number(e.target.value)})} />
                </div>
              </div>

              <Button variant="primary" className="w-full mt-4" onClick={runSweep} isLoading={marketLoading || isSimulating}>
                <Play size={16} className="mr-2" /> {t('robustness.runSweep')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Heatmap */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {marketError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-red-500 shrink-0" />
              <p className="text-red-400 text-sm">{marketError}</p>
            </div>
          )}

          <Card className="liquid-card flex-1 min-h-[500px] border border-[var(--color-border)] shadow-2xl relative overflow-hidden">
            <CardHeader className="border-b border-[var(--color-border)]/50 pb-4 relative z-10">
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <div className="p-2 bg-[var(--color-bg-elevated)] rounded-md border border-[var(--color-border)]">
                  <Play size={18} className="text-[var(--color-accent-blue)]" />
                </div>
                {t('robustness.heatmapTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 relative z-10">
              {sweepResults.length > 0 ? (
                <div className="relative overflow-auto border border-[var(--color-border)] rounded-lg">
                  {/* Generate simple grid for heatmap */}
                  <div className="flex flex-col min-w-[600px]">
                    {Array.from(new Set(sweepResults.map(r => r.p1))).sort((a, b) => b - a).map(p1Val => (
                      <div key={`row-${p1Val}`} className="flex">
                        <div className="w-20 shrink-0 flex items-center justify-center border-r border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-xs font-mono p-2 text-[var(--color-text-primary)]">
                          {param1.key}: {p1Val}
                        </div>
                        {Array.from(new Set(sweepResults.map(r => r.p2))).sort((a, b) => a - b).map(p2Val => {
                          const result = sweepResults.find(r => r.p1 === p1Val && r.p2 === p2Val)
                          return (
                            <div 
                              key={`cell-${p1Val}-${p2Val}`} 
                              className="flex-1 min-w-[80px] h-16 border-r border-b border-[var(--color-border)] flex flex-col items-center justify-center text-xs font-mono transition-transform hover:scale-110 z-10 hover:shadow-lg relative"
                              style={{ backgroundColor: result ? getColor(result.return) : 'transparent' }}
                            >
                              {result ? (
                                <>
                                  <span className="font-bold text-white shadow-sm">{(result.return * 100).toFixed(1)}%</span>
                                  <span className="text-[10px] text-white/90">SR: {result.sharpe.toFixed(2)}</span>
                                </>
                              ) : (
                                <span className="opacity-30">-</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                    <div className="flex">
                      <div className="w-20 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)]" />
                      {Array.from(new Set(sweepResults.map(r => r.p2))).sort((a, b) => a - b).map(p2Val => (
                        <div key={`col-${p2Val}`} className="flex-1 min-w-[80px] flex items-center justify-center bg-[var(--color-bg-elevated)] border-r border-[var(--color-border)] text-xs font-mono p-2 text-[var(--color-text-primary)]">
                          {param2.key}: {p2Val}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-[var(--color-text-secondary)] text-center p-4">
                  {t('robustness.emptyState')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
