import { motion } from 'framer-motion'

interface IconProps {
  size?: number
  className?: string
  active?: boolean
}

const transition: any = { type: "spring", stiffness: 300, damping: 20 }

export function IconDashboard({ size = 24, className = "", active = false }: IconProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" className={className}
      initial="rest" whileHover="hover" animate={active ? "active" : "rest"}
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-blue)" />
          <stop offset="100%" stopColor="var(--color-accent-purple)" />
        </linearGradient>
      </defs>
      <motion.rect 
        x="3" y="3" width="7" height="7" rx="1.5" 
        fill="transparent" stroke="url(#goldGrad)" strokeWidth="1.5"
        variants={{
          rest: { scale: 1, opacity: 0.7 },
          hover: { scale: 1.1, opacity: 1 },
          active: { scale: 1, fill: "url(#goldGrad)", opacity: 1 }
        }}
        transition={transition}
      />
      <motion.rect 
        x="14" y="3" width="7" height="7" rx="1.5" 
        fill="transparent" stroke="url(#goldGrad)" strokeWidth="1.5"
        variants={{
          rest: { scale: 1, opacity: 0.7, rotate: 0 },
          hover: { scale: 1.1, opacity: 1, rotate: 90 },
          active: { scale: 1, fill: "url(#goldGrad)", opacity: 1 }
        }}
        transition={transition}
      />
      <motion.rect 
        x="3" y="14" width="7" height="7" rx="1.5" 
        fill="transparent" stroke="url(#goldGrad)" strokeWidth="1.5"
        variants={{
          rest: { scale: 1, opacity: 0.7, y: 0 },
          hover: { scale: 1.1, opacity: 1, y: -2 },
          active: { scale: 1, fill: "url(#goldGrad)", opacity: 1 }
        }}
        transition={transition}
      />
      <motion.rect 
        x="14" y="14" width="7" height="7" rx="1.5" 
        fill="transparent" stroke="url(#goldGrad)" strokeWidth="1.5"
        variants={{
          rest: { scale: 1, opacity: 0.7 },
          hover: { scale: 0.9, opacity: 1 },
          active: { scale: 1, fill: "url(#goldGrad)", opacity: 1 }
        }}
        transition={transition}
      />
    </motion.svg>
  )
}

export function IconLab({ size = 24, className = "", active = false }: IconProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" className={className}
      initial="rest" whileHover="hover" animate={active ? "active" : "rest"}
    >
      <defs>
        <linearGradient id="labGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-blue)" />
          <stop offset="100%" stopColor="var(--color-accent-purple)" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 12 3 L 12 10 L 18 20 L 6 20 L 12 10"
        fill={active ? "url(#labGrad)" : "transparent"}
        stroke="url(#labGrad)" strokeWidth="1.5" strokeLinejoin="round"
        variants={{
          rest: { scale: 1, opacity: 0.7 },
          hover: { scale: 1.05, opacity: 1, y: -2 },
          active: { scale: 1, opacity: 1 }
        }}
        transition={transition}
      />
      <motion.circle
        cx="12" cy="16" r="1.5" fill="var(--color-bg-primary)"
        variants={{
          rest: { opacity: 0, y: 0 },
          hover: { opacity: 1, y: -4 },
          active: { opacity: 1, y: -2 }
        }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />
    </motion.svg>
  )
}

export function IconVault({ size = 24, className = "", active = false }: IconProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" className={className}
      initial="rest" whileHover="hover" animate={active ? "active" : "rest"}
    >
      <defs>
        <linearGradient id="vaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-purple)" />
          <stop offset="100%" stopColor="var(--color-accent-blue)" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 4 8 L 20 8 L 20 20 L 4 20 Z"
        fill={active ? "url(#vaultGrad)" : "transparent"}
        stroke="url(#vaultGrad)" strokeWidth="1.5"
        variants={{
          rest: { scale: 1, opacity: 0.7 },
          hover: { scale: 1.05, opacity: 1 },
          active: { scale: 1, opacity: 1 }
        }}
      />
      <motion.path
        d="M 8 8 Q 12 2 16 8"
        fill="transparent"
        stroke="url(#vaultGrad)" strokeWidth="1.5" strokeLinecap="round"
        variants={{
          rest: { y: 0 },
          hover: { y: -2 },
          active: { y: 0 }
        }}
      />
      <motion.circle
        cx="12" cy="14" r="2" fill="url(#vaultGrad)"
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.5 },
          active: { scale: 1.2 }
        }}
      />
    </motion.svg>
  )
}

export function IconSettings({ size = 24, className = "", active = false }: IconProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" className={className}
      initial="rest" whileHover="hover" animate={active ? "active" : "rest"}
    >
      <defs>
        <linearGradient id="settingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-text-secondary)" />
          <stop offset="100%" stopColor="var(--color-accent-blue)" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 12 8 A 4 4 0 1 0 12 16 A 4 4 0 1 0 12 8 Z"
        fill={active ? "url(#settingsGrad)" : "transparent"}
        stroke="url(#settingsGrad)" strokeWidth="1.5"
        variants={{
          rest: { scale: 1, opacity: 0.7 },
          hover: { scale: 1.1, opacity: 1 },
          active: { scale: 1, opacity: 1 }
        }}
      />
      <motion.path
        d="M 12 2 L 12 5 M 12 19 L 12 22 M 2 12 L 5 12 M 19 12 L 22 12 M 4.93 4.93 L 7.05 7.05 M 16.95 16.95 L 19.07 19.07 M 4.93 19.07 L 7.05 16.95 M 16.95 4.93 L 19.07 7.05"
        stroke="url(#settingsGrad)" strokeWidth="1.5" strokeLinecap="round"
        variants={{
          rest: { rotate: 0, opacity: 0.7 },
          hover: { rotate: 90, opacity: 1 },
          active: { rotate: 45, opacity: 1 }
        }}
        style={{ originX: "12px", originY: "12px" }}
      />
    </motion.svg>
  )
}

export function IconLogout({ size = 24, className = "", active = false }: IconProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" className={className}
      initial="rest" whileHover="hover" animate={active ? "active" : "rest"}
    >
      <motion.path
        d="M 9 21 H 5 A 2 2 0 0 1 3 19 V 5 A 2 2 0 0 1 5 3 H 9"
        fill="transparent" stroke="var(--color-accent-red)" strokeWidth="1.5" strokeLinecap="round"
        variants={{ rest: { opacity: 0.7 }, hover: { opacity: 1 } }}
      />
      <motion.path
        d="M 16 17 L 21 12 L 16 7"
        fill="transparent" stroke="var(--color-accent-red)" strokeWidth="1.5" strokeLinecap="round"
        variants={{ rest: { x: 0 }, hover: { x: 2 } }}
      />
      <motion.line
        x1="9" y1="12" x2="21" y2="12"
        stroke="var(--color-accent-red)" strokeWidth="1.5" strokeLinecap="round"
        variants={{ rest: { x: 0 }, hover: { x: 2 } }}
      />
    </motion.svg>
  )
}

export function IconAI({ size = 24, className = "", active = false }: IconProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" className={className}
      initial="rest" whileHover="hover" animate={active ? "active" : "rest"}
    >
      <defs>
        <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-highlight)" />
          <stop offset="100%" stopColor="var(--color-accent-blue)" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 12 2 L 15 9 L 22 12 L 15 15 L 12 22 L 9 15 L 2 12 L 9 9 Z"
        fill={active ? "url(#aiGrad)" : "transparent"}
        stroke="url(#aiGrad)" strokeWidth="1.5" strokeLinejoin="round"
        variants={{
          rest: { scale: 1, rotate: 0, opacity: 0.7 },
          hover: { scale: 1.1, rotate: 90, opacity: 1 },
          active: { scale: 1.2, rotate: 180, opacity: 1 }
        }}
        style={{ originX: "12px", originY: "12px" }}
        transition={{ type: "spring", stiffness: 200 }}
      />
    </motion.svg>
  )
}

export function IconMarkets({ size = 24, className = "", active = false }: IconProps) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" className={className}
      initial="rest" whileHover="hover" animate={active ? "active" : "rest"}
    >
      <defs>
        <linearGradient id="mktGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-green)" />
          <stop offset="100%" stopColor="var(--color-accent-blue)" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 3 17 L 9 11 L 13 15 L 21 7"
        fill="transparent"
        stroke="url(#mktGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        variants={{
          rest: { pathLength: 1, opacity: 0.7 },
          hover: { opacity: 1 },
          active: { pathLength: [0, 1], opacity: 1 }
        }}
        transition={{ duration: 0.8 }}
      />
      <motion.circle
        cx="21" cy="7" r="2" fill="url(#mktGrad)"
        variants={{
          rest: { scale: 1, opacity: 0.7 },
          hover: { scale: 1.5, opacity: 1 },
          active: { scale: 1.5, opacity: 1 }
        }}
      />
    </motion.svg>
  )
}
