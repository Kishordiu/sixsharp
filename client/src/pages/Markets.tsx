import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MarketExplorer } from '@/components/ui/MarketExplorer'
import { Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Markets() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSelectAsset = (symbol: string) => {
    navigate(`/strategy-lab?symbol=${symbol}`)
  }

  return (
    <div className="flex flex-col gap-8 w-full mx-auto max-w-[1400px]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-3">
            <Activity className="text-[var(--color-accent-blue)]" />
            {t('markets.title')}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            {t('markets.subtitle')}
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        <MarketExplorer onSelect={handleSelectAsset} />
      </motion.div>
    </div>
  )
}
