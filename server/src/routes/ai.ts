import { Router } from 'express'

const router = Router()

/**
 * POST /api/ai/chat
 * Server-side proxy for the Featherless API to protect the API key.
 * Expected body: { messages: [{ role: 'user' | 'assistant', content: string }] }
 */
router.post('/chat', async (req, res) => {
  try {
    const FEATHERLESS_API_KEY = process.env.FEATHERLESS_API_KEY
    if (!FEATHERLESS_API_KEY) {
      return res.status(500).json({ error: 'Featherless API key is missing on the server.' })
    }

    const { messages } = req.body

    // 1. Basic validation
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' })
    }

    // 2. Length limits (prevent massive context window abuse)
    if (messages.length > 20) {
      return res.status(400).json({ error: 'Conversation too long. Please start a new session.' })
    }

    // 3. Deep validation & Sanitization (only allow specific roles and string content)
    const sanitizedMessages = []
    for (const msg of messages) {
      if (typeof msg !== 'object' || msg === null) {
        return res.status(400).json({ error: 'Invalid message format.' })
      }
      if (msg.role !== 'user' && msg.role !== 'assistant') {
        return res.status(400).json({ error: 'Invalid role. Only user and assistant are allowed.' })
      }
      if (typeof msg.content !== 'string') {
        return res.status(400).json({ error: 'Message content must be a string.' })
      }
      if (msg.content.length > 2000) {
        return res.status(400).json({ error: 'Individual message exceeds maximum length of 2000 characters.' })
      }
      sanitizedMessages.push({ role: msg.role, content: msg.content.trim() })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout

    const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FEATHERLESS_API_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'NousResearch/Meta-Llama-3-8B-Instruct', // Non-gated open model
        messages: [
          {
            role: 'system',
            content: 'You are SIXSHARP, a highly intelligent quantitative finance AI assistant. Answer queries regarding financial analysis, strategy backtesting, risk metrics, and market correlation concisely and mathematically. Never invent fake historical data. Separate facts from your own interpretation.'
          },
          ...sanitizedMessages
        ],
        temperature: 0.2,
        max_tokens: 1000
      })
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Featherless API Error:', errorText)
      throw new Error(`Featherless API responded with status ${response.status}`)
    }

    const data = await response.json()
    res.json(data)
  } catch (error: any) {
    console.error('AI Proxy Route Error:', error)
    res.status(500).json({ error: error.message || 'Failed to communicate with AI service.' })
  }
})

export default router
