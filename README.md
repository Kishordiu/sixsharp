<div align="center">
  <img src="./assets/hero.png" alt="SIXSHARP — quantitative research and backtesting artwork" width="100%" />
</div>

# SIXSHARP

<p align="center">
  <img alt="Research workspace" src="https://img.shields.io/badge/QUANT_RESEARCH-STRATEGY_LAB-0A1826?style=for-the-badge&labelColor=060A0F" />
  <img alt="Architecture" src="https://img.shields.io/badge/ARCHITECTURE-REACT_+_EXPRESS-0A1826?style=for-the-badge&labelColor=060A0F" />
  <img alt="Data layer" src="https://img.shields.io/badge/DATA-SUPABASE_+_MARKET_API-0A1826?style=for-the-badge&labelColor=060A0F" />
</p>

**A multi-asset quantitative research workspace for examining market data, comparing strategies, and exploring risk.**

SIXSHARP is a monorepo that separates a Vite/React client from a Node/Express API. The client uses a Supabase integration for account/data workflows and requests market/AI services through the API; the backend contains market-data and AI routes. The repository is a research tool, not a brokerage, exchange, or live-trading guarantee.

## Research path

```text
React / TypeScript client
       │
       ├──► Supabase Auth / data workflows
       │
       └──► /api requests
                 │
                 ▼
         Node / Express server
            ├── Market data route
            │      └── Yahoo Finance provider
            └── AI route
                   └── Configured Featherless provider
```

## Main work areas

- **Market exploration:** Charts and market views for supported assets.
- **Strategy research:** UI for examining strategy ideas and their historical outcomes.
- **Risk and comparison:** Risk metrics and comparative views whose meaning depends on data quality and assumptions.
- **AI assistant integration:** Server-mediated requests when provider configuration is available.
- **User and workspace flows:** Account and application preferences through the configured Supabase project.

The API depends on external provider availability, rate limits, credentials, and market-data terms. A successful UI build does not confirm a provider is configured or a quote is current.

## Stack

React · TypeScript · Vite · React Router · Recharts / Lightweight Charts · Node.js · Express · Supabase · Yahoo Finance provider · Featherless AI provider

## Run locally

**Requirements:** Node.js compatible with the lockfiles and npm.

### 1. Configure the browser client

From the repository root:

```bash
cp client/.env.example client/.env.local
npm ci --prefix client
npm run dev --prefix client
```

Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_API_URL` in `client/.env.local`. Use only a public/publishable Supabase key in browser-exposed variables.

### 2. Configure the API server

In a second terminal from the repository root:

```bash
cp .env.example .env
npm ci --prefix server
npm run dev --prefix server
```

Add only the server-side values needed for the features you intend to test, such as provider keys and the server-only Supabase service-role key. **Never copy provider secrets or service-role keys into the client environment or commit populated environment files.**

## Checks

```bash
npm run build --prefix client
npm run lint --prefix client
```

Playwright tests live under `client/tests/`; run them against a running application with the required browser binaries before claiming an end-to-end verification.

## Research and risk boundary

Backtests are conditional simulations, not predictions. Results depend on historical data, transaction costs, slippage assumptions, survivorship and look-ahead controls, and the strategy implementation. Do not use the interface as financial advice or a live order execution system without separate implementation, testing, and operational review.

---

<p align="center"><sub>DIU FOUNDRY · QUANTITATIVE RESEARCH / PRODUCT ENGINEERING</sub></p>
