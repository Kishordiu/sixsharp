# SIXSHARP

> **Quantitative intelligence for multi-asset research and backtesting.**

SIXSHARP is a quantitative research and backtesting platform created for the QUANTEX Hackathon. It explores rigorous browser-based strategy testing while making quantitative concepts accessible through a polished interface.

## Core capabilities
- T+1 execution model designed to avoid look-ahead bias
- Position sizing and capital constraints
- Slippage and transaction-cost modelling
- SMA, EMA, RSI, Bollinger Bands and MACD
- Volatility/regime analysis
- Asynchronous parameter sweeps
- Tamil-language accessibility
- Beginner and Pro presentation modes

## Architecture
**Client:** React · TypeScript · Vite

**UI:** Tailwind CSS · Framer Motion · Radix UI

**Charts:** Lightweight Charts · Recharts

**Backend:** Node.js · Express

**Data/Auth:** Supabase

**Testing:** Vitest · Playwright

## Security
API credentials are proxied through the backend rather than exposed in the browser. Supabase Row-Level Security is used for persisted strategy data.

## Local development
~~~bash
npm install
cd client && npm install
cd ../server && npm install
npm run dev
~~~

Configure credentials using the provided environment template. Never commit private API keys.

## Status
**Quant research / hackathon prototype**

## Author
**K. Kishor Kumar** · [GitHub @Kishordiu](https://github.com/Kishordiu)
