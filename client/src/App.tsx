import { useState } from 'react'
import { AuthProvider, useAuth } from './app/providers/AuthProvider'
import { ModeProvider } from './app/providers/ModeProvider'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { ToastProvider } from './app/providers/ToastProvider'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { MatrixCursor } from './components/ui/MatrixCursor'
import { GlobalLoader } from './components/ui/GlobalLoader'
import { LiquidOrbsBackground } from './components/ui/LiquidOrbsBackground'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import StrategyVault from './pages/StrategyVault'
import AiAssistant from './pages/AiAssistant'
import Markets from './pages/Markets'
import StrategyLab from './pages/StrategyLab'
import CorrelationLab from './pages/CorrelationLab'
import RegimeAnalysis from './pages/RegimeAnalysis'
import RobustnessLab from './pages/RobustnessLab'
import Settings from './pages/Settings'
import Profile from './pages/Profile'

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/markets" element={<PageWrapper><Markets /></PageWrapper>} />
        <Route path="/strategy-lab" element={<PageWrapper><StrategyLab /></PageWrapper>} />
        <Route path="/robustness" element={<PageWrapper><RobustnessLab /></PageWrapper>} />
        <Route path="/vault" element={<PageWrapper><StrategyVault /></PageWrapper>} />
        <Route path="/correlation" element={<PageWrapper><CorrelationLab /></PageWrapper>} />
        <Route path="/regime" element={<PageWrapper><RegimeAnalysis /></PageWrapper>} />
        <Route path="/ai" element={<PageWrapper><AiAssistant /></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

function AppContent() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  if (showLoader) {
    return (
      <AnimatePresence>
        <GlobalLoader onComplete={() => setShowLoader(false)} />
      </AnimatePresence>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div 
          className="w-12 h-12 border-4 border-[var(--color-accent-blue)] border-t-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-spin" 
        />
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex overflow-hidden relative">
      {/* Premium 3D Liquid Orbs Background for Dashboard */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b]">
        <div className="noise-overlay" />
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}>
          <LiquidOrbsBackground />
        </Canvas>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-0 pointer-events-none" />
      
      <MatrixCursor />
      
      <div className="z-10 flex w-full h-full">
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <TopBar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 scrollbar-hide">
            <AnimatedRoutes />
          </main>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <ModeProvider>
          <AuthProvider>
            <Router>
              <AppContent />
            </Router>
          </AuthProvider>
        </ModeProvider>
      </ThemeProvider>
    </ToastProvider>
  )
}

export default App
