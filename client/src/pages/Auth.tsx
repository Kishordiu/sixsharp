import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/app/providers/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Lock, Mail, User as UserIcon, Shield, ArrowRight, Camera } from 'lucide-react'
import { LeatherBackground } from '@/components/ui/LeatherBackground'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleAvatarClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) setAvatar(URL.createObjectURL(file))
    }
    input.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        const { error: signInError } = await signIn(email, password)
        if (signInError) throw signInError
        navigate('/dashboard')
      } else {
        const { error: signUpError } = await signUp(email, password, name)
        if (signUpError) throw signUpError
        const { error: signInError } = await signIn(email, password)
        if (signInError) throw signInError
        navigate('/dashboard')
      }
    } catch (err: any) {
      let userError = err.message || 'Authentication failed'
      if (userError.includes('Invalid login credentials')) {
        userError = 'Incorrect email or password.'
      } else if (userError.includes('User already registered')) {
        userError = 'Account already exists.'
      }
      setError(userError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative overflow-hidden">
      
      {/* 3D Leather Background */}
      <LeatherBackground />
      
      {/* Left side - Clean Branding */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-between relative z-10 hidden md:flex text-white">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif tracking-tight"
        >
          SixSharp
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-md"
        >
          <h1 className="text-5xl lg:text-7xl font-serif leading-[1.1] tracking-tight mb-6">
            Quantitative<br />Intelligence.
          </h1>
          <p className="text-lg text-white/60 leading-relaxed font-light">
            Advanced multi-asset portfolio modelling and deterministic backtesting, elevated by institutional-grade architecture.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs uppercase tracking-[0.2em] font-mono text-white/40"
        >
          © 2026 SixSharp Research
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-[500px] lg:w-[600px] bg-black/40 backdrop-blur-3xl border-l border-white/10 p-8 md:p-16 flex flex-col justify-center relative z-20 shadow-2xl">
        
        {/* Mobile Logo */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden text-3xl font-serif text-white tracking-tight mb-12"
        >
          SixSharp
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-serif text-white mb-3">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-white/50 text-sm">
              {isLogin 
                ? 'Enter your details to access the terminal.' 
                : 'Join the next generation of quantitative analysts.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="flex justify-center py-2">
                    <div 
                      onClick={handleAvatarClick}
                      className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden relative group"
                    >
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="text-white/40 group-hover:text-white/80 transition-colors" size={24} />
                      )}
                    </div>
                  </div>

                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<UserIcon size={18} />}
                    required={!isLogin}
                    className="bg-white/5 border-white/10 h-12 text-white placeholder:text-white/30 focus:bg-white/10"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
              className="bg-white/5 border-white/10 h-12 text-white placeholder:text-white/30 focus:bg-white/10"
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
              required
              className="bg-white/5 border-white/10 h-12 text-white placeholder:text-white/30 focus:bg-white/10"
            />

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm flex items-start gap-3 border border-red-500/20"
              >
                <Shield className="shrink-0 mt-0.5" size={16} />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full mt-6 bg-white !text-black hover:bg-white/90 font-medium rounded-xl h-12 transition-all flex items-center justify-center gap-2" 
              isLoading={loading}
            >
              {isLogin ? 'Sign In' : 'Continue'}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="mt-8 text-center pt-6">
            <p className="text-sm text-white/50">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                }}
                className="text-white font-medium hover:underline underline-offset-4"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
