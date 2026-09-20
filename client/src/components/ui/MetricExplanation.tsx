import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'
import { useMode } from '@/app/providers/ModeProvider'

interface MetricExplanationProps {
  metric: string
  beginnerText: string
  proText: string
  children: React.ReactNode
}

export function MetricExplanation({ metric, beginnerText, proText, children }: MetricExplanationProps) {
  const { mode } = useMode()
  const [isHovered, setIsHovered] = useState(false)

  const explanation = mode === 'pro' ? proText : beginnerText

  return (
    <div 
      className="relative flex items-center gap-1.5 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <Info size={14} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-blue)] transition-colors cursor-help" />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-xl z-50 pointer-events-none"
          >
            <div className="text-xs font-semibold text-[var(--color-accent-blue)] mb-1 uppercase tracking-wider">
              {metric} ({mode === 'pro' ? 'PRO' : 'BEGINNER'})
            </div>
            <div className="text-sm text-[var(--color-text-primary)] leading-relaxed">
              {explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
