import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import {
  IconDashboard,
  IconLab,
  IconVault,
  IconSettings,
  IconLogout,
  IconAI,
  IconMarkets
} from '@/components/icons/CustomIcons'
import { useAuth } from '@/app/providers/AuthProvider'
import { useTranslation } from 'react-i18next'

export function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen?: boolean, setMobileMenuOpen?: (v: boolean) => void }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
  const { t } = useTranslation()

  const menuItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: IconDashboard, path: '/dashboard' },
    { id: 'markets', label: t('nav.marketData'), icon: IconMarkets, path: '/markets' },
    { id: 'strategy-lab', label: t('nav.strategyLab'), icon: IconLab, path: '/strategy-lab' },
    { id: 'robustness', label: t('nav.robustness'), icon: IconLab, path: '/robustness' },
    { id: 'vault', label: t('nav.vault'), icon: IconVault, path: '/vault' },
    { id: 'correlation', label: t('nav.correlation'), icon: IconLab, path: '/correlation' },
    { id: 'regime', label: t('nav.regime'), icon: IconMarkets, path: '/regime' },
    { id: 'ai', label: t('nav.ai'), icon: IconAI, path: '/ai' },
    { id: 'settings', label: t('nav.settings'), icon: IconSettings, path: '/settings' },
  ]

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsExpanded(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen?.(false)}
        />
      )}

      <aside
        style={{ 
          width: isMobile ? (mobileMenuOpen ? 260 : 0) : (isExpanded ? 260 : 80),
          transform: isMobile && !mobileMenuOpen ? 'translateX(-300px)' : 'translateX(0)',
          opacity: isMobile && !mobileMenuOpen ? 0 : 1,
        }}
        className={`fixed md:relative z-50 h-full flex flex-col bg-[var(--color-bg-primary)] md:bg-[var(--color-bg-primary)]/80 md:backdrop-blur-xl border-r border-[var(--color-border)] transition-all duration-300 ease-in-out shadow-2xl md:shadow-none overflow-hidden`}
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
      >
      {/* Brand */}
      <div className="h-20 flex items-center px-4 md:px-6 border-b border-[var(--color-border)]/50 shrink-0 overflow-hidden">
        <div className={`h-12 flex items-center shrink-0 transition-all duration-300 ${isExpanded ? 'w-full' : 'w-12 justify-center'}`}>
          <div className="h-10 w-full flex items-center relative overflow-hidden group p-1">
            <img 
              src="/logo.png" 
              alt="SixSharp Logo" 
              className={`h-full w-auto object-contain transition-all duration-300 mix-blend-multiply dark:mix-blend-normal ${!isExpanded ? 'object-left' : 'object-center mx-auto'}`}
              style={{ minWidth: isExpanded ? '120px' : '30px' }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <button
              key={item.id}
              title={item.label}
              aria-label={item.label}
              onClick={() => {
                navigate(item.path)
                setMobileMenuOpen?.(false)
              }}
              className={`w-full flex items-center px-3 py-3 rounded-xl transition-colors duration-200 group relative ${
                isActive 
                  ? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]' 
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <item.icon size={22} className={`shrink-0 ${isActive ? 'scale-110' : ''}`} />
              <span 
                className={`ml-4 font-medium whitespace-nowrap transition-opacity duration-200 ${
                  isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                }`}
              >
                {item.label}
              </span>
              {isActive && isExpanded && (
                <span className="absolute right-3">
                  <ChevronRight size={16} />
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-[var(--color-border)]/50 shrink-0">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors group relative"
        >
          <IconLogout size={22} className="shrink-0" active={false} />
          <span 
            className={`ml-4 font-medium whitespace-nowrap transition-opacity duration-200 ${
              isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            }`}
          >
            {t('nav.signOut')}
          </span>
        </button>
      </div>
    </aside>
    </>
  )
}
