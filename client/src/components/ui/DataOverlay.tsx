import { AlertTriangle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DataOverlayProps {
  loading?: boolean
  error?: string | null
}

export function DataOverlay({ loading, error }: DataOverlayProps) {
  return (
    <AnimatePresence>
      {(loading || error) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[var(--color-bg-primary)]/60 backdrop-blur-md rounded-xl"
        >
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-[var(--color-accent-blue)] animate-spin" />
              <p className="text-sm font-medium text-[var(--color-text-secondary)] animate-pulse">
                Syncing Market Data...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-sm text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="font-semibold text-red-400 mb-1">Asset Data Unavailable</h4>
                <p className="text-xs text-red-400/80 leading-relaxed">{error}</p>
              </div>
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
