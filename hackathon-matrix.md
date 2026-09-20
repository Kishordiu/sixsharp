# HACKATHON FEATURE MATRIX

| Requirement | Implementation Details | Evidence / File Path | Status |
|---|---|---|---|
| **Multi-asset data** | Yahoo Finance proxy integration providing BTC-USD, GOLD, NVDA historical daily bars. | `server/src/services/yahooFinance.ts` | ✅ PASS |
| **SMA / EMA** | Core deterministic math functions for Simple and Exponential moving averages. | `client/src/lib/quant/indicators.ts` | ✅ PASS |
| **Returns / Volatility** | Annualized Return and Volatility computed directly from MTM portfolio value arrays. | `client/src/lib/backtest/engine.ts` | ✅ PASS |
| **Sharpe / Drawdown** | Explicit max drawdown loop calculation and Sharpe Ratio assuming 2% risk-free rate. | `client/src/lib/backtest/engine.ts` | ✅ PASS |
| **Correlation** | Multi-asset static and rolling window (20/60/90) Pearson correlation matrix. | `client/src/pages/CorrelationLab.tsx` | ✅ PASS |
| **SMA / EMA Strategy** | Event-driven crossover strategies yielding 1, 0, -1 signals. | `client/src/lib/backtest/strategies.ts` | ✅ PASS |
| **Momentum / Mean Reversion** | RSI and Bollinger Band strategies representing trend and mean-reversion archetypes. | `client/src/lib/backtest/strategies.ts` | ✅ PASS |
| **Transaction Costs** | Customizable percentage penalty applied explicitly during `ENTRY` and `EXIT` events. | `client/src/lib/backtest/engine.ts` (Execution Phase) | ✅ PASS |
| **Position Sizing** | Fractional capital allocation limits. | `client/src/lib/backtest/engine.ts` | ✅ PASS |
| **t+1 Execution** | Absolute look-ahead bias elimination: Signal generated on `Close` is executed at next bar's `Open`. | `client/src/lib/backtest/engine.ts` (Line 88-93) | ✅ PASS |
| **Benchmark** | Automatic synchronous Buy & Hold benchmark generation for relative comparison. | `client/src/lib/backtest/engine.ts` (`runBenchmark`) | ✅ PASS |
| **Robustness** | 2D parameter heatmap sweep asynchronously processing hundreds of iterations. | `client/src/pages/RobustnessLab.tsx` | ✅ PASS |
| **Regime Analysis** | Risk/Return clustering to classify regimes (High Vol/Bullish, etc). | `client/src/pages/RegimeAnalysis.tsx` | ✅ PASS |
| **Strategy Vault** | Supabase database persistence for strategies with metadata. | `client/src/hooks/useStrategyVault.ts` | ✅ PASS |
| **Pro/Beginner Modes** | UI toggle modifying the complexity of financial metrics and labels. | `client/src/app/providers/ModeProvider.tsx` | ✅ PASS |
| **Tamil Translation** | i18next integration mapping core metrics to native Tamil script (தமிழ்). | `client/src/i18n/locales/ta.json` | ✅ PASS |
| **Voice / AI** | Grounded Featherless AI context injection answering backtest-specific questions securely. | `client/src/services/QuantResearchAIService.ts` | ✅ PASS |
| **RLS / Security** | Tenant-isolated Row-Level Security ensuring no user sees another's vault. | `supabase/migrations/20240101000000_vault_rls.sql` | ✅ PASS |
| **E2E Testing** | Complete 15-step deterministic demonstration script. | `client/tests/judge-demo.spec.ts` | ✅ PASS |
