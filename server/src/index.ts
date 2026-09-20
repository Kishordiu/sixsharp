import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

import marketRoutes from './routes/marketData'
import aiRoutes from './routes/ai'

// Load env from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') })

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'sixsharp-api' })
})

// Routes
app.use('/api/market', marketRoutes)
app.use('/api/ai', aiRoutes)

app.listen(port, () => {
  console.log(`SIXSHARP API server running on port ${port}`)
})
