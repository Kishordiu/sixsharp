import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TrendingUp, Activity, Archive, ArrowRight, Plus, LineChart, PlayCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStrategyVault } from '@/hooks/useStrategyVault'
import { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { DataStatus } from '@/components/ui/DataStatus'
import { SixSharpLoader } from '@/components/ui/SixSharpLoader'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) return
    
    let totalDuration = 1000
    let incrementTime = (totalDuration / end)
    
    const timer = setInterval(() => {
      start += 1
      setDisplayValue(start)
      if (start === end) clearInterval(timer)
    }, incrementTime)
    
    return () => clearInterval(timer)
  }, [value])
  
  return <>{displayValue}</>
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { strategies, loading } = useStrategyVault()
  const { t } = useTranslation()

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center">

      <motion.div 
        className="flex flex-col gap-10 max-w-7xl mx-auto w-full relative z-10 pt-6 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-border)] pb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-semibold text-[var(--color-text-primary)] tracking-tight">
                {t('dashboard.title')}
              </h1>
              <DataStatus status="live" message="Engine Online" />
            </div>
            <p className="text-[var(--color-text-secondary)] text-lg font-light">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => navigate('/markets')} className="glass-card hover:bg-[var(--color-bg-elevated)]">
              <TrendingUp size={16} className="mr-2" /> Market Explorer
            </Button>
            <Button variant="primary" onClick={() => navigate('/strategy-lab')} className="gradient-action shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Plus size={16} className="mr-2" /> New Strategy
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card border-[var(--color-border)]">
            <CardContent className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-2">Saved Models</p>
                  <h3 className="text-5xl font-light text-[var(--color-text-primary)] text-metric">
                    {loading ? <span className="animate-pulse opacity-50">...</span> : <AnimatedNumber value={strategies.length} />}
                  </h3>
                </div>
                <div className="p-3 bg-[var(--color-bg-elevated)] border border-[var(--color-border-light)] rounded text-[var(--color-accent-blue)] shadow-inner">
                  <Archive size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-[var(--color-border)]">
            <CardContent className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-2">Active Integrations</p>
                  <h3 className="text-5xl font-light text-[var(--color-text-primary)] text-metric">
                    3<span className="text-lg text-[var(--color-text-secondary)] font-sans ml-2 tracking-normal">Syncing</span>
                  </h3>
                </div>
                <div className="p-3 bg-[var(--color-bg-elevated)] border border-[var(--color-border-light)] rounded text-[var(--color-accent-green)] shadow-inner">
                  <Activity size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Strategies */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full flex flex-col glass-panel border-[var(--color-border)]">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[var(--color-border)]">
                <CardTitle className="flex items-center gap-2 text-[var(--color-text-primary)] font-medium text-lg">
                  <LineChart className="text-[var(--color-accent-blue)]" size={20} /> 
                  Recent Architectures
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/vault')} className="text-xs font-mono tracking-widest uppercase">
                  View Vault <ArrowRight size={14} className="ml-2" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                {loading ? (
                  <SixSharpLoader message="Loading Vault" />
                ) : strategies.length > 0 ? (
                  <div className="divide-y divide-[var(--color-border)]">
                    {strategies.slice(0, 5).map((strategy, i) => (
                      <motion.div 
                        key={strategy.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 hover:bg-[var(--color-bg-elevated)] transition-colors flex justify-between items-center group cursor-pointer"
                        onClick={() => navigate(`/strategy-lab?strategy=${strategy.id}`)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-highlight)] transition-colors">{strategy.name}</span>
                          <span className="text-xs text-[var(--color-text-muted)] mt-1 font-mono">{new Date(strategy.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="text-right">
                            <div className="text-sm text-[var(--color-text-secondary)]">Sharpe</div>
                            <div className="font-mono text-positive font-medium">{strategy.performance_metrics?.sharpeRatio?.toFixed(2) || 'N/A'}</div>
                          </div>
                          <div className="p-2 rounded-full bg-[var(--color-bg-primary)] group-hover:bg-[var(--color-accent-blue)] group-hover:text-white transition-colors border border-[var(--color-border)] text-[var(--color-text-muted)]">
                            <PlayCircle size={16} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center flex flex-col items-center gap-4 text-[var(--color-text-muted)]">
                    <Archive size={48} className="opacity-20" />
                    <p>No architectures saved yet.</p>
                    <Button variant="secondary" onClick={() => navigate('/strategy-lab')}>
                      Build First Architecture
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions / Status */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <Card className="glass-card border-[var(--color-border)]">
              <CardHeader className="pb-3 border-b border-[var(--color-border)]">
                <CardTitle className="text-sm font-mono tracking-widest text-[var(--color-text-secondary)] uppercase">System Diagnostics</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--color-text-primary)]">Data Pipeline</span>
                  <DataStatus status="live" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--color-text-primary)]">AI Engine</span>
                  <DataStatus status="live" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--color-text-primary)]">Execution Node</span>
                  <DataStatus status="error" message="Disconnected" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
