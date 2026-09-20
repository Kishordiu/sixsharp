import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export type DataStatusLevel = 'live' | 'delayed' | 'error' | 'syncing'

interface DataStatusProps {
  status: DataStatusLevel
  message?: string
  lastUpdated?: string
}

export function DataStatus({ status, message, lastUpdated }: DataStatusProps) {
  const config = {
    live: {
      icon: <CheckCircle2 size={14} className="text-emerald-500" />,
      text: 'Live Connection',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      color: 'text-emerald-500'
    },
    delayed: {
      icon: <Clock size={14} className="text-amber-500" />,
      text: 'Delayed Data',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      color: 'text-amber-500'
    },
    error: {
      icon: <XCircle size={14} className="text-red-500" />,
      text: 'Connection Lost',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      color: 'text-red-500'
    },
    syncing: {
      icon: <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />,
      text: 'Syncing Data...',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      color: 'text-indigo-400'
    }
  }

  const current = config[status]

  return (
    <motion.div 
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${current.bg} ${current.border}`}
    >
      {current.icon}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium tracking-wide ${current.color}`}>
          {message || current.text}
        </span>
        {lastUpdated && status !== 'error' && status !== 'syncing' && (
          <>
            <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{lastUpdated}</span>
          </>
        )}
      </div>
    </motion.div>
  )
}
