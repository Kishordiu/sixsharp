import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AssetCard } from './AssetCard'
import { Search, Loader2 } from 'lucide-react'
import { Input } from './Input'
import { useTranslation } from 'react-i18next'

const DEFAULT_UNIVERSE = [
  { symbol: 'BTC-USD', name: 'Bitcoin', category: 'Crypto' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', category: 'Equity' },
  { symbol: 'GC=F', name: 'Gold Futures', category: 'Commodity' },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'Equity' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Equity' },
  { symbol: 'ETH-USD', name: 'Ethereum', category: 'Crypto' },
]

interface MarketExplorerProps {
  onSelect: (symbol: string) => void
  selectedSymbol?: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function MarketExplorer({ onSelect, selectedSymbol }: MarketExplorerProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [quotes, setQuotes] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    
    const fetchQuotes = async () => {
      setLoading(true)
      const results: Record<string, any> = {}
      
      // Fetch concurrently
      await Promise.all(
        DEFAULT_UNIVERSE.map(async (asset) => {
          try {
            const res = await fetch(`${API_URL}/api/market/quote/${asset.symbol}`)
            const json = await res.json()
            if (json.ok && isMounted) {
              results[asset.symbol] = json
            }
          } catch (e) {
            console.error(`Failed to fetch quote for ${asset.symbol}`, e)
          }
        })
      )
      
      if (isMounted) {
        setQuotes(results)
        setLoading(false)
      }
    }

    fetchQuotes()
    return () => { isMounted = false }
  }, [])

  const filtered = DEFAULT_UNIVERSE.filter(
    (asset) => 
      asset.symbol.toLowerCase().includes(search.toLowerCase()) || 
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] font-logo">{t('markets.title')}</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 flex items-center gap-2">
            {t('markets.subtitle')}
            {loading && <Loader2 size={12} className="animate-spin text-[var(--color-text-muted)]" />}
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Input 
            icon={<Search size={16} />} 
            placeholder="Search universe..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[var(--color-bg-card)] border-[var(--color-border)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filtered.map((asset, i) => (
            <motion.div
              key={asset.symbol}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <AssetCard 
                symbol={asset.symbol} 
                name={asset.name} 
                isSelected={selectedSymbol === asset.symbol}
                onClick={() => onSelect(asset.symbol)}
                price={quotes[asset.symbol]?.price}
                changePercent={quotes[asset.symbol]?.changePercent}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl">
            No assets found matching "{search}"
          </div>
        )}
      </div>
    </div>
  )
}
