import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Settings, Save, Activity, BarChart2, Bot } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { PriceChart } from '@/components/charts/PriceChart'

import { useMarketData } from '@/hooks/useMarketData'
import { useStrategyVault } from '@/hooks/useStrategyVault'
import { useVoice } from '@/hooks/useVoice'
import { useMode } from '@/app/providers/ModeProvider'
import { STRATEGIES } from '@/lib/backtest/strategies'
import { DataOverlay } from '@/components/ui/DataOverlay'
import { BacktestEngine } from '@/lib/backtest/engine'
import type { BacktestConfig, BacktestResult } from '@/lib/backtest/engine'
import { MarketExplorer } from '@/components/ui/MarketExplorer'
import { MetricExplanation } from '@/components/ui/MetricExplanation'
import { useTranslation } from 'react-i18next'

export default function StrategyLab() {
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const strategyIdParam = searchParams.get('strategy')
  
  const { strategies: savedStrategies, saveStrategy } = useStrategyVault()
  const { speak, stop, isSpeaking } = useVoice()
  const { mode } = useMode()
  
  // Market Data State
  const [symbol, setSymbol] = useState('BTC-USD')
  const { data: marketData, loading: marketLoading, error: marketError } = useMarketData(symbol)

  // Strategy State
  const [selectedStrategyId, setSelectedStrategyId] = useState(STRATEGIES[0].id)
  const [parameters, setParameters] = useState<Record<string, number>>(STRATEGIES[0].defaultParameters)
  
  // Backtest State
  const [config, setConfig] = useState<BacktestConfig>({
    initialCapital: 100000,
    transactionCostPct: 0.001,
    positionSizingPct: 1.0,
  })
  const [result, setResult] = useState<BacktestResult | null>(null)
  const [benchmarkResult, setBenchmarkResult] = useState<BacktestResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [aiExplanation, setAiExplanation] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Selected Strategy Object
  const activeStrategyDef = useMemo(() => 
    STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[0]
  , [selectedStrategyId])

  // If loaded from URL params, apply it
  useEffect(() => {
    if (strategyIdParam && savedStrategies.length > 0) {
      const saved = savedStrategies.find(s => s.id === strategyIdParam)
      if (saved) {
        setSaveName(saved.name)
        // Find base strategy match (we don't persist base ID yet, assume from name mapping or default to first)
        // For hackathon, just apply parameters to currently selected
        setParameters(saved.parameters)
      }
    }
  }, [strategyIdParam, savedStrategies])

  // Handle Strategy Change
  const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value
    setSelectedStrategyId(newId)
    const def = STRATEGIES.find(s => s.id === newId)
    if (def) setParameters(def.defaultParameters)
    setResult(null) // Clear previous result
  }

  // Handle Parameter Change
  const handleParamChange = (key: string, value: string) => {
    setParameters(prev => ({ ...prev, [key]: Number(value) }))
  }

  // Run Backtest
  const runBacktest = () => {
    if (!marketData || marketData.length === 0) return

    const validationError = activeStrategyDef.validateParameters(parameters)
    if (validationError) {
      alert(`Invalid Parameters: ${validationError}`)
      return
    }

    setIsSimulating(true)
    
    // Simulate slight delay for UI feel
      setTimeout(() => {
        try {
          const engine = new BacktestEngine(marketData, activeStrategyDef, parameters, config)
          const res = engine.run()
          setResult(res)
          setBenchmarkResult(engine.runBenchmark())
          generateAiExplanation(res, activeStrategyDef.name, symbol)
        } catch (e) {
          console.error(e)
          alert('An error occurred during simulation.')
        } finally {
          setIsSimulating(false)
        }
      }, 500)
    }
  
    const generateAiExplanation = async (res: BacktestResult, strategyName: string, asset: string) => {
      setIsAiLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/ai/completion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: 'You are a senior quantitative analyst. Explain the backtest results briefly, focusing on WHY the strategy might have performed this way (market conditions, strategy logic). Be concise and professional.' },
              { role: 'user', content: `Strategy: ${strategyName} on ${asset}. Total Return: ${(res.summary.totalReturn * 100).toFixed(2)}%. Sharpe: ${res.summary.sharpeRatio.toFixed(2)}. Max Drawdown: ${(res.summary.maxDrawdown * 100).toFixed(2)}%. Win Rate: ${(res.summary.winRate * 100).toFixed(1)}%. Explain these results.` }
            ]
          })
        })
        const data = await response.json()
        if (data.ok && data.data?.choices?.[0]?.message?.content) {
          setAiExplanation(data.data.choices[0].message.content)
        } else {
          setAiExplanation("AI could not generate an explanation at this time.")
        }
      } catch (e) {
        setAiExplanation("Error reaching AI service.")
      } finally {
        setIsAiLoading(false)
      }
    }

  // Handle Save
  const handleSave = async () => {
    if (!saveName.trim()) return alert('Please enter a name for the strategy')
    if (!result) return alert('Please run a backtest first to generate performance metrics')
    
    try {
      await saveStrategy({
        name: saveName,
        description: activeStrategyDef.description,
        parameters,
        performance_metrics: result.summary,
        is_public: false
      })
      alert('Strategy saved to vault!')
    } catch (e: any) {
      alert(`Failed to save: ${e.message}`)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full mx-auto max-w-[1400px]">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-4">
            <div className="p-3 bg-[var(--color-accent-blue)]/10 rounded-xl border border-[var(--color-accent-blue)]/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Activity className="text-[var(--color-accent-blue)] w-7 h-7" />
            </div>
            {t('lab.title')}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] mt-3 max-w-2xl font-light">
            {t('lab.subtitle')}
          </p>
        </motion.div>
      </div>

      <div className="mb-8">
        <MarketExplorer onSelect={setSymbol} selectedSymbol={symbol} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card variant="glass" className="border border-[var(--color-border)] shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-blue)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10 border-b border-[var(--color-border)]/50 pb-4">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold tracking-wide">
                <div className="p-2 bg-[var(--color-bg-elevated)] rounded-md">
                  <Settings size={18} className="text-[var(--color-accent-blue)]" />
                </div>
                {t('lab.config')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 relative z-10">
              <div className="mb-6">
                <div className="p-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg flex justify-between items-center">
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">Active Asset</span>
                  <span className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">{symbol}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">
                  Strategy Algorithm
                </label>
                <select 
                  className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-blue)]"
                  value={selectedStrategyId}
                  onChange={handleStrategyChange}
                >
                  {STRATEGIES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <p className="text-xs text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
                  {activeStrategyDef.description}
                </p>
              </div>

              <div className="border-t border-[var(--color-border)] pt-4 mt-2">
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-3 block uppercase tracking-wider">
                  Parameters
                </label>
                <div className="space-y-3">
                  {Object.keys(parameters).map(key => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)] capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Input 
                        type="number"
                        className="w-24 text-right"
                        value={parameters[key]}
                        onChange={e => handleParamChange(key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {mode === 'pro' && (
                <div className="border-t border-[var(--color-border)] pt-4 mt-2">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-3 block uppercase tracking-wider flex items-center gap-2">
                    <Settings size={12} className="text-cyan-400" />
                    Pro Execution Settings
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">Initial Capital</span>
                      <Input 
                        type="number"
                        className="w-24 text-right"
                        value={config.initialCapital}
                        onChange={e => setConfig({ ...config, initialCapital: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">Tx Cost (%)</span>
                      <Input 
                        type="number"
                        step="0.001"
                        className="w-24 text-right"
                        value={config.transactionCostPct}
                        onChange={e => setConfig({ ...config, transactionCostPct: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button 
                variant="primary" 
                className="w-full mt-4" 
                onClick={runBacktest}
                isLoading={marketLoading || isSimulating}
                disabled={!marketData || marketData.length === 0}
              >
                <Play size={16} className="mr-2" />
                {t('common.runBacktest')}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card variant="glass" className="border border-[var(--color-accent-purple)]/30">
              <CardHeader className="border-b border-[var(--color-border)]/50 pb-3">
                <CardTitle className="text-sm tracking-wider uppercase text-[var(--color-text-secondary)] flex items-center gap-2">
                  <Save size={14} className="text-[var(--color-accent-purple)]" />
                  Save to Vault
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Input 
                  placeholder="Strategy Name" 
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  className="mb-3"
                />
                <Button variant="secondary" className="w-full" onClick={handleSave}>
                  <Save size={16} className="mr-2" /> Save Strategy
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Chart & Results */}
        <div className="lg:col-span-3 flex flex-col gap-6 relative">
          <Card variant="glass" className="flex-1 min-h-[500px] flex flex-col p-5 border border-[var(--color-border)] shadow-2xl relative overflow-hidden">
            <DataOverlay loading={marketLoading} error={marketError} />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-accent-blue)]/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-semibold text-xl flex items-center gap-3">
                <div className="p-2 bg-[var(--color-bg-elevated)] rounded-md border border-[var(--color-border)]">
                  <BarChart2 size={18} className="text-[var(--color-accent-blue)]" />
                </div>
                {symbol} Price Action & Executions
              </h3>
              {result && (
                <div className="flex items-center gap-3 text-sm">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="border border-[var(--color-border)]"
                    onClick={() => {
                      if (isSpeaking) {
                        stop()
                      } else {
                        const summaryText = `SIXSHARP completed the ${activeStrategyDef.name} backtest on ${symbol}. The strategy returned ${((result.summary.totalReturn) * 100).toFixed(1)} percent over the selected period. Maximum drawdown was ${((result.summary.maxDrawdown) * 100).toFixed(1)} percent. The strategy completed ${result.summary.totalTrades} trades with a win rate of ${((result.summary.winRate) * 100).toFixed(0)} percent.`
                        speak(summaryText, 'en') // Pass 'ta' for Tamil if language is switched
                      }
                    }}
                  >
                    {isSpeaking ? 'Stop Summary' : 'Play Summary'}
                  </Button>
                  <div className="px-3 py-1 rounded bg-[var(--color-bg-elevated)]">
                    <span className="text-[var(--color-text-secondary)] mr-2">Trades:</span>
                    <span className="font-mono text-white">{result.summary.totalTrades}</span>
                  </div>
                  <div className="px-3 py-1 rounded bg-[var(--color-bg-elevated)]">
                    <span className="text-[var(--color-text-secondary)] mr-2">Win Rate:</span>
                    <span className={`font-mono ${result.summary.winRate > 0.5 ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-accent-red)]'}`}>
                      {(result.summary.winRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 relative rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/30 z-10">
              {marketLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-card)]/50 backdrop-blur-md z-20">
                  <div className="w-8 h-8 border-2 border-[var(--color-accent-blue)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : marketData ? (
                <PriceChart 
                  data={marketData} 
                  trades={result?.trades} 
                  height={500} 
                />
              ) : null}
            </div>
          </Card>

          {/* Performance Metrics */}
          {result && benchmarkResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <Card variant="glass">
                <CardContent className="p-5">
                  <MetricExplanation 
                    metric="Total Return" 
                    beginnerText="The total percentage of profit or loss made on your original money."
                    proText="Cumulative ROI over the entire backtest window, not adjusted for inflation or risk."
                  >
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Total Return</p>
                  </MetricExplanation>
                  <p className={`text-2xl font-bold font-mono ${result.summary.totalReturn >= 0 ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-accent-red)]'}`}>
                    {(result.summary.totalReturn * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    B&H: {(benchmarkResult.summary.totalReturn * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardContent className="p-5">
                  <MetricExplanation 
                    metric="Annualized Return" 
                    beginnerText="How much profit you would make on average in one year."
                    proText="CAGR (Compound Annual Growth Rate), geometric progression ratio over a one-year period."
                  >
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Annualized</p>
                  </MetricExplanation>
                  <p className={`text-2xl font-bold font-mono ${result.summary.annualizedReturn >= 0 ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-accent-red)]'}`}>
                    {(result.summary.annualizedReturn * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    B&H: {(benchmarkResult.summary.annualizedReturn * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardContent className="p-5">
                  <MetricExplanation 
                    metric="Sharpe Ratio" 
                    beginnerText="A score showing if your profit is worth the risk you took. Higher is better."
                    proText="Measure of risk-adjusted return (excess return divided by standard deviation of returns)."
                  >
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Sharpe Ratio</p>
                  </MetricExplanation>
                  <p className="text-2xl font-bold font-mono text-white">
                    {result.summary.sharpeRatio.toFixed(2)}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    B&H: {benchmarkResult.summary.sharpeRatio.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardContent className="p-5">
                  <MetricExplanation 
                    metric="Max Drawdown" 
                    beginnerText="The largest drop in account balance from its highest point. Shows worst-case scenario."
                    proText="Maximum observed loss from a peak to a trough of a portfolio, before a new peak is attained."
                  >
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Max Drawdown</p>
                  </MetricExplanation>
                  <p className="text-2xl font-bold font-mono text-[var(--color-accent-red)]">
                    {(result.summary.maxDrawdown * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    B&H: {(benchmarkResult.summary.maxDrawdown * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* AI Explanation Card */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2"
            >
              <Card className="liquid-card border-[var(--color-accent-purple)]/50">
                <CardHeader className="pb-3 border-b border-white/10">
                  <CardTitle className="text-sm tracking-wider uppercase text-[var(--color-accent-purple)] flex items-center gap-2">
                    <Bot size={16} />
                    AI Quantitative Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {isAiLoading ? (
                    <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
                      <div className="w-4 h-4 border-2 border-[var(--color-accent-purple)] border-t-transparent rounded-full animate-spin" />
                      Analyzing strategy execution...
                    </div>
                  ) : (
                    <div className="text-[var(--color-text-secondary)] text-sm leading-relaxed prose prose-invert max-w-none">
                      {aiExplanation}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Ledger Pane (Trades) */}
          {result && result.trades.length > 0 && (
            <Card variant="glass" className="flex-1 mt-6">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity size={16} className="text-[var(--color-accent-blue)]" />
                  Trade Ledger
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
                      <th className="py-2 px-4 font-medium uppercase tracking-wider text-xs">Time</th>
                      <th className="py-2 px-4 font-medium uppercase tracking-wider text-xs">Type</th>
                      <th className="py-2 px-4 font-medium uppercase tracking-wider text-xs text-right">Price</th>
                      <th className="py-2 px-4 font-medium uppercase tracking-wider text-xs text-right">Shares</th>
                      <th className="py-2 px-4 font-medium uppercase tracking-wider text-xs text-right">Cost</th>
                      <th className="py-2 px-4 font-medium uppercase tracking-wider text-xs text-right">PnL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.trades.slice().reverse().map((t, i) => (
                      <tr key={i} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-bg-elevated)]/30 transition-colors">
                        <td className="py-2 px-4 whitespace-nowrap text-[var(--color-text-primary)]">{t.time}</td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${t.direction === 'LONG' ? 'bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]' : 'bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)]'}`}>
                            {t.type} {t.direction}
                          </span>
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap text-right font-mono">${t.price.toFixed(2)}</td>
                        <td className="py-2 px-4 whitespace-nowrap text-right font-mono">{t.shares.toFixed(4)}</td>
                        <td className="py-2 px-4 whitespace-nowrap text-right font-mono text-[var(--color-text-muted)]">${t.cost.toFixed(2)}</td>
                        <td className={`py-2 px-4 whitespace-nowrap text-right font-mono font-medium ${!t.pnl ? 'text-[var(--color-text-muted)]' : t.pnl > 0 ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-accent-red)]'}`}>
                          {t.pnl ? (t.pnl > 0 ? '+' : '') + t.pnl.toFixed(2) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
