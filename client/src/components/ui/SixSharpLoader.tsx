import { motion } from 'framer-motion'

export function SixSharpLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4 text-[var(--color-text-muted)]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-8 h-8 border-2 border-[var(--color-accent-blue)] border-t-transparent rounded-full"
      />
      <p className="font-mono text-sm tracking-wider uppercase animate-pulse">{message}</p>
    </div>
  )
}
