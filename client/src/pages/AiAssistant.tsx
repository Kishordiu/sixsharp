import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, User, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useMode } from '@/app/providers/ModeProvider'
import { QuantResearchAIService } from '@/services/QuantResearchAIService'

import { useTranslation } from 'react-i18next'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AiAssistant() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am the SIXSHARP quantitative AI assistant. How can I help you analyze markets or backtest strategies today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { mode } = useMode()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const aiReply = await QuantResearchAIService.sendChat([...messages.map(m => ({ role: m.role, content: m.content })), userMsg], mode as 'beginner' | 'pro')
      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }])
    } catch (error: any) {
      console.error(error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error connecting to the AI: ${error.message}` 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto w-full relative">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-3">
          <Bot className="text-[var(--color-accent-blue)]" />
          {t('ai_assistant.title')}
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          {t('ai_assistant.subtitle')}
        </p>
      </div>

      <Card variant="glass" className="flex-1 flex flex-col overflow-hidden border-[var(--color-border-light)] shadow-2xl relative z-10">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]' 
                    : 'bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] text-white shadow-lg shadow-[var(--color-accent-blue)]/20'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-tr-none'
                    : 'bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)] border border-[var(--color-accent-blue)]/20 rounded-tl-none shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-text-primary)]">
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 flex-row"
              >
                <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)] border border-[var(--color-accent-blue)]/20 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-[var(--color-accent-blue)]" />
                  <span className="text-sm text-[var(--color-text-secondary)]">Analyzing...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'pro' ? "Enter query (e.g. 'Analyze NVDA vs BTC correlation regime')" : "Ask a question about trading..."}
                disabled={isLoading}
                className="pr-12 py-6 text-base rounded-xl"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-accent-purple)] opacity-50 pointer-events-none">
                <Sparkles size={18} />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="px-6 rounded-xl"
            >
              <Send size={18} className={input.trim() && !isLoading ? "text-white" : "text-[var(--color-text-muted)]"} />
            </Button>
          </form>
          
          {/* Quick Prompts */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {[
              "Explain SMA Crossover", 
              "What is Sharpe Ratio?",
              "How do I reduce drawdown?"
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent-blue)]/50 hover:text-[var(--color-accent-blue)] transition-colors text-[var(--color-text-secondary)]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </Card>
      
      {/* Decorative Orbs */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-accent-blue)]/20 rounded-full blur-[60px]" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--color-accent-purple)]/20 rounded-full blur-[60px]" />
    </div>
  )
}
