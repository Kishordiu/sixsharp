# SIXSHARP Architectural Structure

The SIXSHARP platform is a monolithic repository separating a Vite/React/TypeScript client from a lightweight Node/Express/TypeScript API Gateway backend, heavily integrated with Supabase and Featherless AI.

## High-Level Architecture
```mermaid
graph TD
    Client[Client (React/Vite)] -->|Auth & DB queries| Supabase[(Supabase DB & Auth)]
    Client -->|Market & AI requests| API_Proxy[Node.js API Proxy]
    API_Proxy -->|Fetch Quotes| Yahoo[Yahoo Finance API]
    API_Proxy -->|LLM Inference| Featherless[Featherless AI]
```

## Directory Structure
```text
a:\Quantexa - HackHere\
├── client/                     # Frontend Application
│   ├── .env                    # Client environment (VITE_SUPABASE_URL, VITE_API_URL)
│   ├── index.html              # Entry HTML
│   ├── playwright.config.ts    # E2E Test configuration
│   ├── tailwind.config.js      # Removed (Migrated to Tailwind v4 @theme)
│   ├── tests/                  # Playwright Test Suites
│   │   ├── e2e.spec.ts         # Master QA Flow (37 steps)
│   │   └── judge-demo.spec.ts  # Hackathon Judge Demo Flow (15 steps)
│   └── src/
│       ├── App.tsx             # Root Layout and App Router
│       ├── index.css           # Global Styles & Tailwind v4 Theme
│       ├── i18n.ts             # Internationalization config (English/Tamil)
│       ├── app/
│       │   └── providers/      # Global Contexts (Auth, ModeProvider)
│       ├── components/
│       │   ├── charts/         # TradingView Lightweight Charts
│       │   │   ├── PriceChart.tsx
│       │   │   └── HeatmapChart.tsx
│       │   ├── layout/         # Navigation & Structure
│       │   │   ├── Sidebar.tsx
│       │   │   └── Topbar.tsx
│       │   └── ui/             # Reusable UI primitives (Buttons, Cards, Inputs)
│       ├── hooks/              # Custom React Hooks (e.g., useMarketData, useAuth)
│       ├── pages/              # Core Application Views
│       │   ├── Auth.tsx             # Login / Split-screen Auth
│       │   ├── Dashboard.tsx        # Portfolio Overview
│       │   ├── Markets.tsx          # Real-time Asset Tracking
│       │   ├── StrategyLab.tsx      # Core Backtesting Engine
│       │   ├── RobustnessLab.tsx    # Monte Carlo & Heatmaps
│       │   ├── StrategyVault.tsx    # Saved Strategies
│       │   ├── CorrelationLab.tsx   # Multi-asset correlations
│       │   ├── RegimeAnalysis.tsx   # Market Regime detection
│       │   ├── AiAssistant.tsx      # Featherless AI Chat
│       │   └── Settings.tsx         # User Preferences
│       └── services/           # External API Clients
│           ├── MarketDataService.ts # Client wrapper for backend proxy
│           ├── QuantResearchAIService.ts # AI context formatting & dispatch
│           └── quantEngine.ts       # Core Math (SMA, EMA, RSI, Bollinger, Sharpe)
│
├── server/                     # Backend API Proxy
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts            # Express Server Entry (Port 3001)
│       ├── routes/             # API Endpoints
│       │   ├── market.ts       # Maps to Yahoo Finance
│       │   └── ai.ts           # Proxies Featherless AI securely
│       └── services/
│           └── yahooFinance.ts # Yahoo Finance API wrapper
│
└── supabase/                   # Supabase Infrastructure (if local)
    └── migrations/             # SQL Schema definitions
```

## Core Design Philosophy (UI/UX)
1. **Glassmorphic Paneling:** Background elements utilize blur and subtle borders to layer information gracefully.
2. **Deterministic Layouts:** The sidebar and topbar remain fixed to preserve navigational state during complex data computations.
3. **Data Visualization First:** The primary focal point of any view is the data. Gradients (`var(--color-accent-blue)`) are used strictly to draw attention to positive returns, active navigation links, and primary CTA buttons.
4. **Adaptive Context (Pro vs Beginner):** The application interface scales its complexity dynamically, swapping heavy quantitative jargon for natural language explanations when requested by the user.
