# SIXSHARP

**Quantitative multi-asset research and backtesting.**

SIXSHARP brings market-data access, strategy experiments, risk metrics and a browser-based research workspace together. Its engineering goal is to make backtest assumptions visible instead of presenting a return figure without context.

## What it covers

- Historical multi-asset market-data access through the API server
- Technical indicators and strategy evaluation
- Portfolio returns, volatility, Sharpe ratio and drawdown metrics
- Correlation analysis and parameter experiments
- A separate server boundary for market-data and AI-provider credentials

See [the feature matrix](hackathon-matrix.md) and [architecture notes](architecture_structure.md) for implementation/file references. Treat market data and backtest results as research outputs, not investment advice.

## Repository layout

- `client/` — React, TypeScript and Vite interface
- `server/` — Node.js/Express API for market data and AI requests
- `supabase/` — database/auth assets and SQL configuration

## Run locally

**Requirements:** Node.js 20+ and npm.

### 1. Configure the API server

From the repository root:

```bash
cp .env.example .env
```

Edit the root `.env` with your own keys. Start the server in terminal one:

```bash
cd server
npm ci
npm run dev
```

The server defaults to port `3001`; its health endpoint is `http://localhost:3001/api/health`.

### 2. Configure the frontend

In terminal two, from the repository root:

```bash
cp client/.env.example client/.env
cd client
npm ci
npm run dev
```

Vite prints the frontend URL (configured for port `5173`).

## Environment and security

The root `.env.example` is for the **server only**. The separate `client/.env.example` contains browser variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_API_URL`

Anything prefixed with `VITE_` can be visible to users in the built frontend. Use only a public/publishable Supabase key there. Never place `SUPABASE_SERVICE_ROLE_KEY`, `FEATHERLESS_API_KEY`, or other private credentials in the client environment or frontend code. Keep Supabase Row Level Security policies enabled and tested.

## Quality checks

```bash
cd client
npm run build
npm run lint
npx playwright test
```

Run the checks against the current commit before treating a feature as verified.

## Stack

React · TypeScript · Vite · Node.js · Express · Supabase · Yahoo Finance integration · Featherless AI · Lightweight Charts · Recharts · Playwright
