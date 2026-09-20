# SIXSHARP

**Quantitative Intelligence for Multi-Asset Markets**

SIXSHARP is a professional-grade, multi-asset quantitative research and backtesting platform built for the **QUANTEX Hackathon**. It transforms complex historical financial data into actionable, mathematically rigorous insights through a beautiful, accessible interface.

---

## The Problem
Quantitative finance tools are historically fragmented. Retail and intermediate traders are forced to choose between highly technical code-based environments (Python/Pandas/Zipline) with steep learning curves, or consumer-grade charting tools that lack true rigorous backtesting capabilities and look-ahead bias protection.

## The SIXSHARP Solution
SIXSHARP bridges this gap by providing an institutional-grade, event-driven backtesting engine entirely in the browser, wrapped in a meticulously crafted design system. 

### Key Innovations
- **Strict t+1 Execution Engine:** Our backtest engine simulates real-world execution. Signals generated on the Close of day `t` are explicitly executed on the Open of day `t+1`, mathematically eliminating look-ahead bias.
- **Featherless AI Voice Grounding:** We proxy all AI requests securely on the backend and enforce strict context injection. The AI speaks to *actual* generated backtest metrics, explicitly preventing hallucinations.
- **Bilingual Accessibility:** Full platform translation to Tamil (தமிழ்) covering technical financial terminology, democratizing quantitative research.
- **Pro/Beginner Modes:** Dynamic complexity scaling. Pro mode exposes deep metrics (Annualized Volatility, Max Drawdown). Beginner mode translates these into accessible language (Risk-Adjusted Performance, Worst Drop).
- **Asynchronous Robustness Sweeps:** A massive parameter-sweep engine running permutations without freezing the main UI thread.

---

## Architecture & Tech Stack
- **Frontend Engine:** React 18, TypeScript, Vite
- **UI/UX & Design:** TailwindCSS, Framer Motion, Radix UI (NordPixel & Lightswind Design Tokens)
- **Charts:** Lightweight Charts (TradingView) & Recharts
- **Backend Proxy:** Node.js, Express (Proxies Yahoo Finance and Featherless AI to protect keys)
- **Database & Auth:** Supabase (PostgreSQL with strict Row-Level Security)
- **Testing:** Vitest (Unit/Quant), Playwright (E2E)

---

## Quantitative Engine Capabilities
Our internal `BacktestEngine` supports:
- **Capital Constraints & Position Sizing:** Fractional share allocation based on dynamic capital limits.
- **Slippage & Transaction Costs:** Mathematically penalized trades representing real-world friction.
- **Multi-Indicator Math:** SMA, EMA, RSI, Bollinger Bands, and MACD.
- **Regime Classification:** Multi-dimensional volatility clustering.

---

## Setup & Local Development

1. **Clone & Install**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. **Environment Variables**
   Create a `.env` file from `.env.example` and populate your Supabase and Featherless AI keys.

3. **Run Locally**
   Start the backend and frontend concurrently:
   ```bash
   npm run dev
   ```

---

## Security
SIXSHARP takes data security seriously:
- **Row-Level Security (RLS):** All saved strategies in the Vault are isolated per tenant.
- **API Masking:** All AI inference calls route through the Node server, preventing the `FEATHERLESS_API_KEY` from leaking into the browser bundle.

## Future Scope
- **Live Trading Execution:** Webhook integration for brokerages (Alpaca, Interactive Brokers).
- **Options Pricing:** Integrating Black-Scholes surfaces.
- **WebAssembly Engine:** Migrating the core `BacktestEngine` to Rust (WASM) for millisecond latency on 10,000+ iteration Robustness sweeps.
