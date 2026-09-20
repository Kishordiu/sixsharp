import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Play, Edit3, Share2, Archive } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useStrategyVault } from '@/hooks/useStrategyVault'
import { useToast } from '@/app/providers/ToastProvider'
import { useTranslation } from 'react-i18next'

export default function StrategyVault() {
  const { strategies, loading, deleteStrategy } = useStrategyVault()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  // 3D Carousel State
  const [activeIndex, setActiveIndex] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'return' | 'sharpe'>('date')

  const filteredStrategies = strategies
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === 'return') return (b.performance_metrics?.totalReturn || 0) - (a.performance_metrics?.totalReturn || 0)
      if (sortBy === 'sharpe') return (b.performance_metrics?.sharpeRatio || 0) - (a.performance_metrics?.sharpeRatio || 0)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this strategy?')) return
    setIsDeleting(id)
    try {
      await deleteStrategy(id)
      toast('Strategy deleted successfully', 'success')
      if (activeIndex >= filteredStrategies.length - 1) {
        setActiveIndex(Math.max(0, filteredStrategies.length - 2))
      }
    } catch (err) {
      toast('Failed to delete strategy', 'error')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full relative">
      <div className="flex items-center justify-between z-10 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-3">
            <Archive className="text-[var(--color-accent-purple)]" size={36} />
            {t('vault.title')}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 text-lg">
            {t('vault.subtitle')}
          </p>
        </div>
        <Button onClick={() => navigate('/strategy-lab')} leftIcon={<Plus size={20} />} size="lg" className="shadow-[0_0_20px_rgba(139,92,246,0.3)]">
          {t('common.newStrategy')}
        </Button>
      </div>

      <div className="flex gap-4 mb-8 z-10 relative">
        <input 
          type="text" 
          placeholder="Filter by tags, name, or description..." 
          className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-blue)]"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setActiveIndex(0) }}
        />
        <select 
          className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-blue)]"
          value={sortBy}
          onChange={e => { setSortBy(e.target.value as any); setActiveIndex(0) }}
        >
          <option value="date">Sort by Date</option>
          <option value="return">Sort by Total Return</option>
          <option value="sharpe">Sort by Sharpe Ratio</option>
        </select>
      </div>

      {loading && strategies.length === 0 ? (
        <div className="flex items-center justify-center h-[500px]">
          <div className="w-16 h-16 border-4 border-[var(--color-accent-purple)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : strategies.length === 0 ? (
        <Card variant="glass" className="py-24 flex flex-col items-center justify-center text-center mt-12 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg-elevated)] flex items-center justify-center mb-6 shadow-inner">
            <Archive size={40} className="text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-3">{t('vault.empty')}</h3>
          <p className="text-[var(--color-text-secondary)] mb-8 text-lg">
            You haven't saved any quantitative strategies yet. Head over to the Strategy Lab to design and backtest your first algorithm.
          </p>
          <Button onClick={() => navigate('/strategy-lab')} size="lg">
            Enter Strategy Lab
          </Button>
        </Card>
      ) : filteredStrategies.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[500px]">
           <p className="text-[var(--color-text-secondary)] text-lg">No strategies match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          <AnimatePresence>
            {filteredStrategies.map((strategy) => (
              <motion.div
                key={strategy.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Card className="liquid-card h-full flex flex-col group hover:-translate-y-2 transition-transform duration-300 shadow-lg border-[var(--color-border)] hover:border-[var(--color-accent-purple)]/50">
                  <CardHeader className="flex-1 pb-2 relative overflow-hidden rounded-t-xl">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <CardTitle className="text-xl font-bold tracking-tight font-logo text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-blue)] transition-colors">
                        {strategy.name}
                      </CardTitle>
                      {strategy.is_public && (
                        <span className="liquid-tag text-[10px] uppercase font-bold tracking-wider text-[var(--color-accent-blue)]">
                          Public
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed relative z-10">
                      {strategy.description || 'No description provided for this quantitative setup.'}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-4 pb-6 flex-1 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(strategy.parameters).map(([key, value]) => (
                        <div key={key} className="bg-[var(--color-bg-elevated)]/50 border border-[var(--color-border)] p-2 rounded-lg text-center">
                          <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1 truncate px-1" title={key}>{key}</div>
                          <div className="text-sm font-mono text-[var(--color-text-primary)] font-medium">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <div className="border-t border-[var(--color-border)] p-4 flex flex-col gap-3 bg-[var(--color-bg-elevated)]/30 rounded-b-xl relative z-10 mt-auto">
                    <Button 
                      variant="primary" 
                      className="w-full shadow-lg shadow-[var(--color-accent-blue)]/20"
                      onClick={() => navigate(`/strategy-lab?strategy=${strategy.id}`)}
                    >
                      <Play size={16} className="mr-2" /> 
                      Run Backtest
                    </Button>
                    
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="sm" className="px-3 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-blue)]" onClick={() => navigate(`/strategy-lab?strategy=${strategy.id}`)}>
                        <Edit3 size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="px-3 text-[var(--color-text-secondary)] hover:text-green-500" onClick={() => { navigator.clipboard.writeText(window.location.origin + '/strategy-lab?strategy=' + strategy.id); toast('Strategy Link Copied!', 'success') }}>
                        <Share2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost"  
                        size="sm" 
                        className="px-3 text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-500/10"
                        isLoading={isDeleting === strategy.id}
                        onClick={(e) => handleDelete(strategy.id, e)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
