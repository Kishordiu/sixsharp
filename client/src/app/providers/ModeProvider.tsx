import { createContext, useContext, useState, type ReactNode } from 'react'

type InterfaceMode = 'pro' | 'beginner'

interface ModeContextType {
  mode: InterfaceMode
  setMode: (mode: InterfaceMode) => void
  toggleMode: () => void
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<InterfaceMode>(
    () => (localStorage.getItem('sixsharp_mode') as InterfaceMode) || 'beginner'
  )

  const handleSetMode = (newMode: InterfaceMode) => {
    setMode(newMode)
    localStorage.setItem('sixsharp_mode', newMode)
  }

  const toggleMode = () => {
    handleSetMode(mode === 'pro' ? 'beginner' : 'pro')
  }

  return (
    <ModeContext.Provider value={{ mode, setMode: handleSetMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}
