# SIXSHARP

![Cinematic hero](https://capsule-render.vercel.app/api?type=rect&color=0:10100C,100:2A2114&height=230&text=SIXSHARP&fontColor=F3F3EE&fontSize=40&fontAlignY=38&desc=QUANTITATIVE%20RESEARCH%20%2F%20BACKTESTING&descColor=999991&descSize=12&descAlignY=66&animation=fadeIn)

> **Quantitative research / backtesting.**

SIXSHARP is a quantitative research and backtesting platform built around a core principle: execution assumptions should be visible instead of hidden behind a headline return.

## WHAT IT EXPLORES

- Multi-asset market data for research workflows
- SMA/EMA, momentum and mean-reversion strategy experiments
- Returns, volatility, Sharpe ratio, drawdown and correlation analysis
- Transaction-cost, slippage, position-sizing and execution assumptions
- An AI research interface behind a server-side API boundary

Read [the architecture](architecture_structure.md) and [the feature matrix](hackathon-matrix.md) for the intended system boundaries and implementation map. Treat strategy results as research estimates, not investment advice or a guarantee of future returns.

## ARCHITECTURE

The repository separates a React/Vite client from a Node/Express API. The client runs on port 5173 and proxies `/api` to the API server on port 3001 during local development. The server loads its private configuration from the repository-root `.env`.

## RUN LOCALLY

Requirements: Node.js and npm. Use **two terminals** from the repository root.

First, configure the server:

```bash
cp .env.example .env
```

Edit `.env` and provide the credentials you actually need for the integrations you intend to test. Never put these server-only values in client environment variables.

**Terminal 1 — API server**

```bash
npm ci --prefix server
npm run dev --prefix server
```

**Terminal 2 — web client**

```bash
cp client/.env.example client/.env.local
npm ci --prefix client
npm run dev --prefix client
```

Open `http://localhost:5173`. For a production client build, run `npm run build --prefix client`. For client linting, run `npm run lint --prefix client`.

## ENVIRONMENT AND SECURITY

- Root `.env.example` is for the server only. It includes placeholders for provider credentials and the Supabase service-role key.
- `client/.env.example` contains browser-facing variables. Any `VITE_*` value is visible in the built client and must never contain a service-role key, password or private provider token.
- Keep `.env` and `.env.local` files untracked. Test Supabase access control and RLS policies before using real data.

## PROJECT STATE

**React · TypeScript · Vite · Node.js · Express · Supabase · Lightweight Charts · Recharts · Playwright**

The repository distinguishes implemented behaviour from planned integrations. Run the build and relevant tests against the current commit before relying on a feature.

---
Maintained by [K. Kishor Kumar](https://github.com/Kishordiu).
