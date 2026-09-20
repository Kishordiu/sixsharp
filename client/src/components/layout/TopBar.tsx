import { useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useMode } from '@/app/providers/ModeProvider'
import { LogOut, Globe, Menu, Sun, Moon, User as UserIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/app/providers/ThemeProvider'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, signOut } = useAuth()
  const { mode, toggleMode } = useMode()
  const { i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)

  const isPro = mode === 'pro'
  const isDark = theme === 'dark'

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith('en') ? 'ta' : 'en')
  }

  return (
    <header className="h-16 border-b border-[var(--color-border)]/50 backdrop-blur-md bg-[var(--color-bg-primary)]/80 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 transition-colors duration-300">
      
      <div className="flex items-center gap-3 flex-1">
        <button 
          onClick={onMenuClick} 
          className="md:hidden p-2 -ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <Menu size={24} />
        </button>
        {/* Page context — shows current location */}
        <div className="hidden md:flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <span className="text-xl font-logo text-[var(--color-text-primary)] tracking-wider">SixSharp</span>
          <span className="text-[var(--color-text-muted)]">•</span>
          <span className="font-serif italic">Quantitative Research</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 relative">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-accent-green)] hover:bg-[var(--color-bg-elevated)] transition-all"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all
            bg-[var(--color-bg-secondary)] border border-[var(--color-border)]/50 hover:border-[var(--color-text-muted)]
            text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shadow-sm"
        >
          <Globe size={14} />
          <span>{i18n.language.startsWith('ta') ? 'தமிழ்' : 'EN'}</span>
        </button>

        {/* 3D Realistic Toggle Switch — Pro/Beginner */}
        <div className="flex items-center gap-2 bg-[var(--color-bg-secondary)] px-3 py-1.5 rounded-2xl border border-[var(--color-border)]/50 shadow-inner">
          <span className={`text-xs font-semibold transition-colors duration-300 ${!isPro ? 'text-[var(--color-accent-purple)]' : 'text-[var(--color-text-muted)]'}`}>
            BEGINNER
          </span>
          
          <button
            onClick={toggleMode}
            className="relative w-12 h-6 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:outline-none transition-colors duration-300 flex items-center px-0.5"
            title="Toggle Mode"
          >
            <div 
              className={`w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-b from-gray-300 to-gray-500 shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-300 ease-spring ${
                isPro ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <div 
                className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] transition-colors duration-300 ${
                  isPro ? 'bg-[var(--color-accent-green)] text-[var(--color-accent-green)]' : 'bg-[var(--color-accent-purple)] text-[var(--color-accent-purple)]'
                }`}
              />
            </div>
          </button>
          
          <span className={`text-xs font-semibold transition-colors duration-300 ${isPro ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-text-muted)]'}`}>
            PRO
          </span>
        </div>

        {/* User Dropdown */}
        {user && (
          <div className="relative ml-1 pl-3 border-l border-[var(--color-border)]/50">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] flex items-center justify-center shadow-inner hover:border-[var(--color-accent-green)] transition-all overflow-hidden">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[var(--color-text-primary)] text-sm font-serif">
                    {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <>
                  {/* Invisible backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-[90]" 
                    onClick={() => setShowDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{ transformOrigin: 'top right' }}
                    className="absolute right-0 mt-4 w-64 glass-panel py-2 z-[100] shadow-2xl border border-[var(--color-border-focus)] rounded-xl"
                  >
                    <div className="px-4 py-3 border-b border-[var(--color-border)] bg-black/20">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {user.user_metadata?.full_name || 'Analyst'}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] truncate">
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="py-2 px-2">
                      <Link 
                        to="/profile" 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] hover:bg-white/10 transition-all hover:pl-4 group"
                      >
                        <UserIcon size={16} className="text-[var(--color-accent-green)] group-hover:scale-110 transition-transform" />
                        Analyst Profile
                      </Link>
                    </div>
                    
                    <div className="py-2 px-2 border-t border-[var(--color-border)]">
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          signOut()
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left group"
                      >
                        <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  )
}
