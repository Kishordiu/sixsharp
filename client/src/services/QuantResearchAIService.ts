import type { BacktestResult } from '@/lib/backtest/engine'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export class QuantResearchAIService {
  private static getApiUrl() {
    return import.meta.env.VITE_API_URL || 'http://localhost:3001'
  }

  /**
   * Sends a chat payload to the secure AI proxy on the backend.
   */
  static async sendChat(messages: ChatMessage[], mode: 'beginner' | 'pro' = 'beginner'): Promise<string> {
    const API_URL = this.getApiUrl()
    
    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      })

      if (!response.ok) {
        throw new Error('AI research proxy error.')
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content || 'No response generated.'
    } catch (error) {
      console.warn('Featherless AI proxy unavailable. Falling back to local offline AI model.', error)
      return this.generateOfflineFallback(messages[messages.length - 1].content, mode)
    }
  }

  private static generateOfflineFallback(query: string, mode: 'beginner' | 'pro'): string {
    const q = query.toLowerCase()
    
    if (q.includes('sma') || q.includes('crossover')) {
      return mode === 'pro'
        ? "PRO INSIGHT: The Simple Moving Average (SMA) crossover is a momentum-based trend-following strategy. A 'golden cross' (e.g., 50-day crossing above 200-day) signals a bullish regime shift, while a 'death cross' implies bearish momentum. Statistically, in high-volatility environments like crypto, shorter lookback periods (e.g., 9-day/21-day) minimize lag but increase whipsaw risk. Maximize Sharpe by combining with ATR for dynamic position sizing."
        : "BEGINNER GUIDE: Imagine two moving lines that track the average price of an asset over time. One line tracks a short time (like the last 10 days) and the other tracks a long time (like the last 50 days). When the short-term line crosses ABOVE the long-term line, it means the price is speeding up upwards! This is usually a signal to BUY. For example, if Bitcoin's 10-day average crosses its 50-day average, many traders expect the price to keep going up."
    }
    
    if (q.includes('sharpe')) {
      return mode === 'pro'
        ? "PRO INSIGHT: The Sharpe Ratio measures the excess return per unit of deviation in an investment asset or a trading strategy ( (Rx - Rf) / StdDev(Rx) ). A Sharpe > 1.5 is considered good for retail, while institutional HFTs target > 3.0. Note that Sharpe assumes a normal distribution of returns; for asymmetric assets (like options or crypto), Sortino or Calmar ratios often provide better downside risk assessment."
        : "BEGINNER GUIDE: The Sharpe Ratio is a score that tells you if the risk you took was worth the reward. If you made 20% profit, but your account swung wildly up and down every day, your Sharpe ratio is low. If you made 20% profit and it was a smooth, steady climb with almost no stress, your Sharpe ratio is high! Generally, you want a Sharpe ratio higher than 1.0."
    }
    
    if (q.includes('drawdown')) {
      return mode === 'pro'
        ? "PRO INSIGHT: Maximum Drawdown (MDD) is the maximum observed loss from a peak to a trough of a portfolio, before a new peak is attained. Controlling MDD is critical for capital preservation. Professional strategies often use volatility targeting (e.g., Target Vol = 15% annualized) or trailing stop-losses based on Average True Range (ATR) to truncate the left tail of the return distribution."
        : "BEGINNER GUIDE: Drawdown is simply the biggest drop your account takes from its highest point. If you start with $100, grow it to $150, and then it falls to $100 before going back up, you suffered a $50 drawdown (a 33.3% drop from the peak). It measures the 'pain' of holding a strategy. Lower drawdown means less stress!"
    }

    return mode === 'pro'
      ? `PRO INSIGHT: Analyzing query [${query}]. Based on offline heuristic analysis, ensure you are accounting for transaction costs and slippage in your model. Further deep-learning inference requires API connectivity.`
      : `BEGINNER GUIDE: That's a great question about "${query}"! I'm currently running in offline mode, but remember: the golden rule of trading is to manage your risk. Never risk more than 1-2% of your account on a single trade!`
  }

  /**
   * Generate a grounded explanation for a specific backtest result.
   */
  static async explainBacktest(result: BacktestResult, contextMsg: string): Promise<string> {
    const groundedPrompt = `
      I have just run a backtest using SIXSHARP. Here are the core metrics:
      - Engine Version: ${result.engineVersion}
      - Total Return: ${(result.summary.totalReturn * 100).toFixed(2)}%
      - Max Drawdown: ${(result.summary.maxDrawdown * 100).toFixed(2)}%
      - Sharpe Ratio: ${result.summary.sharpeRatio.toFixed(2)}
      - Win Rate: ${(result.summary.winRate * 100).toFixed(1)}%
      
      User Question: ${contextMsg}
    `.trim()

    return this.sendChat([{ role: 'user', content: groundedPrompt }])
  }
}
