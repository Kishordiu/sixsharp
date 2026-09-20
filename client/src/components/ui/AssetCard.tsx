import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { MetricExplanation } from './MetricExplanation'

interface AssetCardProps {
  symbol: string
  name: string
  price?: number
  changePercent?: number
  isSelected?: boolean
  onClick?: () => void
}

export function AssetCard({ symbol, name, price, changePercent, isSelected, onClick }: AssetCardProps) {
  const isPositive = (changePercent || 0) >= 0

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden rounded-xl p-5 transition-all duration-300 h-full flex flex-col justify-between ${
        isSelected 
          ? 'bg-[var(--color-bg-elevated)] border border-[var(--color-highlight)] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
          : 'liquid-card'
      }`}
    >
      {isSelected && (
        <div className="absolute inset-0 bg-[var(--color-highlight)]/5 pointer-events-none" />
      )}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">{symbol}</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{name}</p>
        </div>
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-[var(--color-highlight)] text-white' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]'} transition-colors`}>
          <Activity size={16} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1 relative z-10">
        {price !== undefined ? (
          <>
            <MetricExplanation 
              metric="Live Price" 
              beginnerText="The current trading price of this asset in the open market."
              proText="Latest executed real-time quote, representing the most recent transaction matching bid/ask spread."
            >
              <span className="text-2xl font-light text-[var(--color-text-primary)] text-metric">
                ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </MetricExplanation>
            <div className={`flex items-center gap-1 text-xs font-mono font-medium ${isPositive ? 'text-positive' : 'text-negative'}`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{Math.abs(changePercent || 0).toFixed(2)}%</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 mt-1">
            <div className="h-6 w-24 bg-[var(--color-border)] rounded animate-pulse" />
            <div className="h-4 w-12 bg-[var(--color-border)] rounded animate-pulse" />
          </div>
        )}
      </div>
    </motion.div>
  )
}
