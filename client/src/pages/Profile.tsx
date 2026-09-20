import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/app/providers/AuthProvider'
import { Camera, Save, LogOut, Activity, Database, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function Profile() {
  const { user, signOut } = useAuth()
  const [name, setName] = useState(user?.user_metadata?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [avatar, setAvatar] = useState<string | null>(user?.user_metadata?.avatar_url || null)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // Simulate API call for saving profile
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1500)
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6 relative z-10">
      
      {/* Background ambient glow for profile specifically */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-accent-green)]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--color-border)]"
        >
          <div>
            <h1 className="text-4xl font-serif font-medium text-[var(--color-text-primary)] tracking-tight">Analyst Profile</h1>
            <p className="text-[var(--color-text-secondary)] mt-2">Manage your credentials, preferences, and workspace settings.</p>
          </div>
          
          <Button 
            variant="secondary" 
            onClick={signOut}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center gap-2 rounded-xl"
          >
            <LogOut size={16} />
            Terminate Session
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="liquid-card p-8 flex flex-col items-center text-center">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <div 
                onClick={handleAvatarClick}
                className="w-32 h-32 rounded-full border-2 border-dashed border-[var(--color-border-focus)] flex items-center justify-center cursor-pointer hover:border-[var(--color-accent-green)] hover:bg-white/5 transition-all overflow-hidden relative group mb-6 shadow-2xl"
              >
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-primary)] flex items-center justify-center">
                    <span className="text-4xl font-serif text-[var(--color-text-muted)]">
                      {name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Camera className="text-white mb-2" size={24} />
                  <span className="text-[10px] font-medium text-white uppercase tracking-wider">Update Photo</span>
                </div>
              </div>

              <h2 className="text-xl font-medium text-[var(--color-text-primary)]">{name || 'Quant Analyst'}</h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{email}</p>
              
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/20 text-[var(--color-accent-green)] text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
                CLEARANCE LEVEL: PRO
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Usage Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <Database size={16} className="text-[var(--color-accent-blue)]" />
                    <span className="text-sm">Compute Hours</span>
                  </div>
                  <span className="text-sm font-mono text-[var(--color-text-secondary)]">124.5 / 500</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-accent-blue)] w-1/4 rounded-full" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <Activity size={16} className="text-[var(--color-accent-green)]" />
                    <span className="text-sm">Active Strategies</span>
                  </div>
                  <span className="text-sm font-mono text-[var(--color-text-secondary)]">3</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Edit Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="liquid-card p-8">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-6">Personal Information</h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Full Name</label>
                    <Input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="bg-[var(--color-bg-primary)]/50 border-[var(--color-border-light)] focus:bg-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Email Address</label>
                    <Input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      disabled
                      className="bg-[var(--color-bg-primary)]/30 border-[var(--color-border)] opacity-60 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--color-border)]">
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-6">Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">New Password</label>
                      <Input 
                        type="password" 
                        placeholder="••••••••"
                        className="bg-[var(--color-bg-primary)]/50 border-[var(--color-border-light)] focus:bg-white/5"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Confirm Password</label>
                      <Input 
                        type="password" 
                        placeholder="••••••••"
                        className="bg-[var(--color-bg-primary)]/50 border-[var(--color-border-light)] focus:bg-white/5"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-end gap-4">
                  {saved && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-[var(--color-accent-green)] text-sm"
                    >
                      <Check size={16} />
                      <span>Profile updated</span>
                    </motion.div>
                  )}
                  <Button 
                    type="submit" 
                    isLoading={isSaving}
                    className="bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] hover:bg-white min-w-[120px] rounded-xl"
                  >
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  )
}
