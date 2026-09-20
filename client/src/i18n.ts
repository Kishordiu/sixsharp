import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      "app": {
        "title": "SixSharp",
        "tagline": "Quantitative Multi-Asset Intelligence"
      },
      "nav": {
        "dashboard": "Dashboard",
        "strategyLab": "Strategy Lab",
        "marketData": "Market Data",
        "robustness": "Robustness Lab",
        "correlation": "Correlation Lab",
        "regime": "Regime Analysis",
        "vault": "Strategy Vault",
        "ai": "Quant AI",
        "settings": "Settings",
        "signOut": "Sign Out"
      },
      "common": {
        "loading": "Loading...",
        "save": "Save",
        "run": "Run",
        "error": "An error occurred",
        "newStrategy": "New Strategy",
        "runBacktest": "Run Backtest",
        "saveStrategy": "Save Strategy",
        "delete": "Delete",
        "edit": "Edit",
        "share": "Share",
        "confirm": "Are you sure?",
        "cancel": "Cancel",
        "noData": "No data available",
        "activeAsset": "Active Asset",
        "strategyAlgo": "Strategy Algorithm",
        "parameters": "Parameters",
        "proSettings": "Pro Execution Settings",
        "initialCapital": "Initial Capital",
        "txCost": "Tx Cost (%)",
        "saveToVault": "Save to Vault",
        "strategyName": "Strategy Name"
      },
      "dashboard": {
        "title": "Welcome back",
        "subtitle": "Here's an overview of your quantitative portfolio and active models.",
        "marketOverview": "Market Overview",
        "recentModels": "Recent Models",
        "activePositions": "Active Positions",
        "totalValue": "Total Value",
        "dayReturn": "Day Return",
        "activeStrats": "Active Strats",
        "engineTitle": "SixSharp Engine",
        "engineDesc": "Sub-millisecond quantitative analysis powered by advanced neural networks."
      },
      "markets": {
        "title": "Market Explorer",
        "subtitle": "Select an asset to begin modeling.",
        "searchPlaceholder": "Search universe..."
      },
      "vault": {
        "title": "Strategy Vault",
        "subtitle": "Manage your saved quantitative strategies and algorithms",
        "empty": "Your vault is empty",
        "emptyDesc": "You haven't saved any quantitative strategies yet. Head over to the Strategy Lab to design and backtest your first algorithm.",
        "enterLab": "Enter Strategy Lab",
        "noMatch": "No strategies match your filter.",
        "filterPlaceholder": "Filter by tags, name, or description...",
        "sortDate": "Sort by Date",
        "sortReturn": "Sort by Total Return",
        "sortSharpe": "Sort by Sharpe Ratio",
        "confirmDelete": "Are you sure you want to delete this strategy?",
        "deleteSuccess": "Strategy deleted successfully",
        "deleteFail": "Failed to delete strategy",
        "linkCopied": "Strategy Link Copied!",
        "runBacktest": "Run Backtest"
      },
      "lab": {
        "title": "Strategy Lab",
        "subtitle": "Design, configure, and backtest quantitative strategies with sub-millisecond precision.",
        "config": "Configuration",
        "priceAction": "Price Action & Executions",
        "playSummary": "Play Summary",
        "stopSummary": "Stop Summary",
        "trades": "Trades",
        "winRate": "Win Rate",
        "tradeLedger": "Trade Ledger",
        "time": "Time",
        "type": "Type",
        "price": "Price",
        "shares": "Shares",
        "cost": "Cost",
        "pnl": "PnL",
        "aiAnalysis": "AI Quantitative Analysis",
        "analyzingExecution": "Analyzing strategy execution..."
      },
      "metrics": {
        "totalReturn": "Total Return",
        "annualized": "Annualized",
        "sharpeRatio": "Sharpe Ratio",
        "maxDrawdown": "Max Drawdown",
        "totalReturnBeginnerDesc": "The total percentage of profit or loss made on your original money. For example, if you invested $100 and now have $120, your total return is +20%.",
        "totalReturnProDesc": "Cumulative ROI over the entire backtest window, not adjusted for inflation or risk. Computed as (Final Equity / Initial Capital) - 1.",
        "annualizedBeginnerDesc": "How much profit you would make on average in one year if the returns kept going at the same rate.",
        "annualizedProDesc": "CAGR (Compound Annual Growth Rate), geometric progression ratio over a one-year period, calculated as (1 + Total Return)^(252/Trading Days) - 1.",
        "sharpeBeginnerDesc": "A score showing if your profit is worth the risk you took. A score above 1 is good, above 2 is excellent. The higher, the better!",
        "sharpeProDesc": "Measure of risk-adjusted return: (Mean Daily Return - Risk-Free Rate) / Std(Daily Returns) × √252. Values above 1.0 indicate alpha generation.",
        "drawdownBeginnerDesc": "The largest drop in your account balance from its highest point. Shows the worst-case scenario — how much money you could have lost at the worst time.",
        "drawdownProDesc": "Maximum observed loss from a portfolio peak to a subsequent trough before a new peak is attained. Critical for sizing and risk management."
      },
      "robustness": {
        "title": "Robustness Lab",
        "subtitle": "Perform parameter sweeps and visualize strategy stability across varying conditions.",
        "sweepConfig": "Sweep Configuration",
        "assetSymbol": "Asset Symbol",
        "strategy": "Strategy",
        "param1": "Parameter 1 (Y-Axis)",
        "param2": "Parameter 2 (X-Axis)",
        "runSweep": "Run Sweep",
        "heatmapTitle": "Performance Heatmap (Total Return)",
        "emptyState": "Configure parameters and run a sweep to generate heatmap.",
        "beginnerExplain": "This lab tests whether your strategy works under different settings. Each colored box shows how much profit (green) or loss (red) your strategy would have made with those specific parameter values. A robust strategy shows green across many different settings, meaning it's not just lucky with one particular configuration.",
        "proExplain": "Parameter sensitivity analysis via exhaustive grid search over the specified parameter space. The heatmap visualizes Total Return (color-coded) and Sharpe Ratio for each (p1, p2) combination. A robust strategy exhibits low variance across the parameter surface, indicating reduced overfitting risk and stable alpha generation."
      },
      "correlation": {
        "title": "Cross-Asset Correlation Lab",
        "subtitle": "Analyze Pearson correlation matrices across macro and crypto assets."
      },
      "regime": {
        "title": "Market Regime Analysis",
        "subtitle": "Detect volatility and trend regimes using Hidden Markov Models."
      },
      "ai_assistant": {
        "title": "Quantitative AI Assistant",
        "subtitle": "Powered by Featherless AI. Ask anything about finance, strategies, or how to use the platform."
      },
      "settings": {
        "title": "Settings",
        "appearance": "Appearance",
        "language": "Language",
        "researchDefaults": "Research Defaults",
        "aiAssistant": "AI Assistant",
        "voice": "Voice",
        "accessibility": "Accessibility",
        "theme": "Theme",
        "themeDesc": "Choose between dark and light mode.",
        "dark": "Dark",
        "light": "Light",
        "interfaceMode": "Interface Mode",
        "interfaceModeDesc": "Beginner mode provides simplified explanations. Pro mode shows full quantitative terminology.",
        "interfaceLang": "Interface Language",
        "interfaceLangDesc": "All UI labels, descriptions, and system messages will use this language.",
        "riskFreeRate": "Risk-Free Rate",
        "riskFreeRateDesc": "Annual risk-free rate used for Sharpe ratio calculations (default: 2%)",
        "defaultCapital": "Default Capital",
        "defaultCapitalDesc": "Starting capital for new backtests",
        "defaultTxCost": "Default Transaction Cost",
        "defaultTxCostDesc": "Fee percentage per trade (default: 0.1%)",
        "aiModel": "Model",
        "aiModelDesc": "The AI model used for research analysis",
        "aiProvider": "Provider",
        "aiProviderDesc": "AI inference provider",
        "aiSecurity": "Security",
        "aiSecurityDesc": "API key management",
        "keySecured": "Key secured on server",
        "voiceOutput": "Voice Output",
        "voiceOutputDesc": "Enable or disable voice narration of backtest results",
        "voiceLang": "Voice Language",
        "voiceLangDesc": "Voice narration follows the interface language setting",
        "reducedMotion": "Reduced Motion",
        "reducedMotionDesc": "Minimize animations and transitions throughout the application"
      }
    }
  },
  ta: {
    translation: {
      "app": {
        "title": "SixSharp",
        "tagline": "அளவுசார் பல சொத்து நுண்ணறிவு"
      },
      "nav": {
        "dashboard": "முகப்பு",
        "strategyLab": "வியூக ஆய்வகம்",
        "marketData": "சந்தை தரவு",
        "robustness": "உறுதி ஆய்வகம்",
        "correlation": "தொடர்பு ஆய்வகம்",
        "regime": "ஆட்சி பகுப்பாய்வு",
        "vault": "வியூக பெட்டகம்",
        "ai": "க்வாண்ட் AI",
        "settings": "அமைப்புகள்",
        "signOut": "வெளியேறு"
      },
      "common": {
        "loading": "ஏற்றுகிறது...",
        "save": "சேமி",
        "run": "இயக்கு",
        "error": "ஒரு பிழை ஏற்பட்டது",
        "newStrategy": "புதிய வியூகம்",
        "runBacktest": "பின்தோன்றல் இயக்கு",
        "saveStrategy": "வியூகம் சேமி",
        "delete": "நீக்கு",
        "edit": "திருத்து",
        "share": "பகிர்",
        "confirm": "உறுதியா?",
        "cancel": "ரத்து",
        "noData": "தரவு இல்லை",
        "activeAsset": "செயலில் சொத்து",
        "strategyAlgo": "வியூக வழிமுறை",
        "parameters": "அளவுருக்கள்",
        "proSettings": "ப்ரோ செயல்திறன் அமைப்புகள்",
        "initialCapital": "ஆரம்ப மூலதனம்",
        "txCost": "பரிவர்த்தனை செலவு (%)",
        "saveToVault": "பெட்டகத்தில் சேமி",
        "strategyName": "வியூக பெயர்"
      },
      "dashboard": {
        "title": "மீண்டும் வரவேற்கிறோம்",
        "subtitle": "உங்கள் அளவுசார் போர்ட்ஃபோலியோ மற்றும் செயலில் உள்ள மாடல்களின் கண்ணோட்டம்.",
        "marketOverview": "சந்தை கண்ணோட்டம்",
        "recentModels": "சமீபத்திய மாதிரிகள்",
        "activePositions": "செயலில் உள்ள நிலைகள்",
        "totalValue": "மொத்த மதிப்பு",
        "dayReturn": "நாள் வருமானம்",
        "activeStrats": "செயலில் உள்ள வியூகங்கள்",
        "engineTitle": "SixSharp இயந்திரம்",
        "engineDesc": "மேம்பட்ட நரம்பு வலையமைப்புகளால் இயக்கப்படும் துணை-மில்லிவினாடி அளவுசார் பகுப்பாய்வு."
      },
      "markets": {
        "title": "சந்தை எக்ஸ்ப்ளோரர்",
        "subtitle": "மாடலிங் தொடங்க ஒரு சொத்தைத் தேர்ந்தெடுக்கவும்.",
        "searchPlaceholder": "பிரபஞ்சத்தில் தேடு..."
      },
      "vault": {
        "title": "வியூக பெட்டகம்",
        "subtitle": "சேமிக்கப்பட்ட வியூகங்களை நிர்வகிக்கவும்",
        "empty": "உங்கள் பெட்டகம் காலியாக உள்ளது",
        "emptyDesc": "நீங்கள் இதுவரை எந்த அளவுசார் வியூகங்களையும் சேமிக்கவில்லை. உங்கள் முதல் வழிமுறையை வடிவமைக்க வியூக ஆய்வகத்திற்குச் செல்லுங்கள்.",
        "enterLab": "வியூக ஆய்வகத்தில் நுழைக",
        "noMatch": "உங்கள் வடிகட்டலுக்கு வியூகங்கள் இல்லை.",
        "filterPlaceholder": "குறிச்சொற்கள், பெயர் அல்லது விவரணை மூலம் வடிகட்டு...",
        "sortDate": "தேதி வாரியாக",
        "sortReturn": "மொத்த வருமானம் வாரியாக",
        "sortSharpe": "ஷார்ப் விகிதம் வாரியாக",
        "confirmDelete": "இந்த வியூகத்தை நீக்க விரும்புகிறீர்களா?",
        "deleteSuccess": "வியூகம் வெற்றிகரமாக நீக்கப்பட்டது",
        "deleteFail": "வியூகத்தை நீக்க இயலவில்லை",
        "linkCopied": "வியூக இணைப்பு நகலெடுக்கப்பட்டது!",
        "runBacktest": "பின்தோன்றல் இயக்கு"
      },
      "lab": {
        "title": "வியூக ஆய்வகம்",
        "subtitle": "துல்லியத்துடன் வியூகங்களை வடிவமைத்து சோதிக்கவும்.",
        "config": "கட்டமைப்பு",
        "priceAction": "விலை நடவடிக்கை & செயல்படுத்தல்",
        "playSummary": "சுருக்கம் இயக்கு",
        "stopSummary": "சுருக்கம் நிறுத்து",
        "trades": "வர்த்தகங்கள்",
        "winRate": "வெற்றி விகிதம்",
        "tradeLedger": "வர்த்தக பேரேடு",
        "time": "நேரம்",
        "type": "வகை",
        "price": "விலை",
        "shares": "பங்குகள்",
        "cost": "செலவு",
        "pnl": "லாபம்/நஷ்டம்",
        "aiAnalysis": "AI அளவுசார் பகுப்பாய்வு",
        "analyzingExecution": "வியூக செயல்படுத்தலை பகுப்பாய்வு செய்கிறது..."
      },
      "metrics": {
        "totalReturn": "மொத்த வருமானம்",
        "annualized": "ஆண்டு",
        "sharpeRatio": "ஷார்ப் விகிதம்",
        "maxDrawdown": "அதிகபட்ச சரிவு",
        "totalReturnBeginnerDesc": "உங்கள் அசல் பணத்தில் ஈட்டிய மொத்த லாபம் அல்லது நஷ்ட சதவீதம். உதாரணமாக, நீங்கள் ₹100 முதலீடு செய்து இப்போது ₹120 இருந்தால், உங்கள் மொத்த வருமானம் +20%.",
        "totalReturnProDesc": "முழு பின்தோன்றல் காலத்தில் திரட்டப்பட்ட ROI, பணவீக்கம் அல்லது ஆபத்துக்கு சரிசெய்யப்படவில்லை. (இறுதி மூலதனம் / ஆரம்ப மூலதனம்) - 1 என கணக்கிடப்படுகிறது.",
        "annualizedBeginnerDesc": "வருமானம் அதே விகிதத்தில் தொடர்ந்தால் ஒரு வருடத்தில் சராசரியாக எவ்வளவு லாபம் கிடைக்கும்.",
        "annualizedProDesc": "CAGR (கூட்டு ஆண்டு வளர்ச்சி விகிதம்), ஒரு வருட காலத்திற்கான வடிவியல் முன்னேற்ற விகிதம்.",
        "sharpeBeginnerDesc": "உங்கள் லாபம் நீங்கள் எடுத்த ஆபத்துக்கு மதிப்புள்ளதா என்பதைக் காட்டும் மதிப்பெண். 1 க்கு மேல் நல்லது, 2 க்கு மேல் சிறப்பு!",
        "sharpeProDesc": "ஆபத்து-சரிசெய்யப்பட்ட வருமான அளவீடு: (சராசரி தினசரி வருமானம் - ஆபத்தில்லா விகிதம்) / Std(தினசரி வருமானம்) × √252.",
        "drawdownBeginnerDesc": "உங்கள் கணக்கு இருப்பில் அதிகபட்ச சரிவு. மோசமான சூழ்நிலையில் எவ்வளவு பணம் இழக்கக்கூடும் என்பதைக் காட்டுகிறது.",
        "drawdownProDesc": "ஒரு போர்ட்ஃபோலியோ உச்சத்திலிருந்து அடுத்த தாழ்வு நிலைக்கு அதிகபட்ச கவனிக்கப்பட்ட இழப்பு."
      },
      "robustness": {
        "title": "உறுதி ஆய்வகம்",
        "subtitle": "அளவுரு ஸ்வீப்களை செய்து மாறுபட்ட நிலைகளில் வியூக நிலைத்தன்மையை காட்சிப்படுத்தவும்.",
        "sweepConfig": "ஸ்வீப் கட்டமைப்பு",
        "assetSymbol": "சொத்து குறியீடு",
        "strategy": "வியூகம்",
        "param1": "அளவுரு 1 (Y-அச்சு)",
        "param2": "அளவுரு 2 (X-அச்சு)",
        "runSweep": "ஸ்வீப் இயக்கு",
        "heatmapTitle": "செயல்திறன் வெப்ப வரைபடம் (மொத்த வருமானம்)",
        "emptyState": "வெப்ப வரைபடத்தை உருவாக்க அளவுருக்களை கட்டமைத்து ஸ்வீப் இயக்கவும்.",
        "beginnerExplain": "இந்த ஆய்வகம் உங்கள் வியூகம் வெவ்வேறு அமைப்புகளில் வேலை செய்கிறதா என்பதை சோதிக்கிறது. ஒவ்வொரு வண்ண பெட்டியும் குறிப்பிட்ட அளவுரு மதிப்புகளுடன் உங்கள் வியூகம் எவ்வளவு லாபம் (பச்சை) அல்லது நஷ்டம் (சிவப்பு) ஈட்டியிருக்கும் என்பதைக் காட்டுகிறது.",
        "proExplain": "குறிப்பிட்ட அளவுரு இடத்தின் மீது முழுமையான கட்ட தேடல் வழியாக அளவுரு உணர்திறன் பகுப்பாய்வு. வெப்ப வரைபடம் ஒவ்வொரு (p1, p2) கலவைக்கும் மொத்த வருமானத்தை (நிறம்-குறியீடு) மற்றும் ஷார்ப் விகிதத்தை காட்சிப்படுத்துகிறது."
      },
      "correlation": {
        "title": "குறுக்கு-சொத்து தொடர்பு ஆய்வகம்",
        "subtitle": "மேக்ரோ மற்றும் கிரிப்டோ சொத்துக்கள் முழுவதும் பியர்சன் தொடர்பு மெட்ரிக்குகளை பகுப்பாய்வு செய்யுங்கள்."
      },
      "regime": {
        "title": "சந்தை ஆட்சி பகுப்பாய்வு",
        "subtitle": "மறைக்கப்பட்ட மார்கோவ் மாதிரிகளைப் பயன்படுத்தி ஏற்ற இறக்கம் மற்றும் போக்கு ஆட்சிகளைக் கண்டறியவும்."
      },
      "ai_assistant": {
        "title": "அளவுசார் AI உதவியாளர்",
        "subtitle": "Featherless AI மூலம் இயக்கப்படுகிறது. நிதி, வியூகங்கள் அல்லது தளத்தை எவ்வாறு பயன்படுத்துவது என்பது பற்றி எதையும் கேளுங்கள்."
      },
      "settings": {
        "title": "அமைப்புகள்",
        "appearance": "தோற்றம்",
        "language": "மொழி",
        "researchDefaults": "ஆராய்ச்சி இயல்புநிலைகள்",
        "aiAssistant": "AI உதவியாளர்",
        "voice": "குரல்",
        "accessibility": "அணுகல்தன்மை",
        "theme": "தீம்",
        "themeDesc": "இருண்ட மற்றும் ஒளி பயன்முறைக்கு இடையே தேர்வு செய்யவும்.",
        "dark": "இருண்ட",
        "light": "ஒளி",
        "interfaceMode": "இடைமுக பயன்முறை",
        "interfaceModeDesc": "தொடக்கநிலை பயன்முறை எளிமையான விளக்கங்களை வழங்குகிறது. ப்ரோ பயன்முறை முழு அளவுசார் சொற்களைக் காட்டுகிறது.",
        "interfaceLang": "இடைமுக மொழி",
        "interfaceLangDesc": "அனைத்து UI லேபிள்கள், விளக்கங்கள் மற்றும் அமைப்பு செய்திகள் இந்த மொழியைப் பயன்படுத்தும்.",
        "riskFreeRate": "ஆபத்தில்லா விகிதம்",
        "riskFreeRateDesc": "ஷார்ப் விகிதம் கணக்கீடுகளுக்குப் பயன்படுத்தப்படும் ஆண்டு ஆபத்தில்லா விகிதம்",
        "defaultCapital": "இயல்புநிலை மூலதனம்",
        "defaultCapitalDesc": "புதிய பின்தோன்றல்களுக்கான தொடக்க மூலதனம்",
        "defaultTxCost": "இயல்புநிலை பரிவர்த்தனை செலவு",
        "defaultTxCostDesc": "ஒரு வர்த்தகத்திற்கான கட்டண சதவீதம்",
        "aiModel": "மாடல்",
        "aiModelDesc": "ஆராய்ச்சி பகுப்பாய்வுக்கு பயன்படுத்தப்படும் AI மாடல்",
        "aiProvider": "வழங்குநர்",
        "aiProviderDesc": "AI ஊகிப்பு வழங்குநர்",
        "aiSecurity": "பாதுகாப்பு",
        "aiSecurityDesc": "API விசை மேலாண்மை",
        "keySecured": "சேவையகத்தில் விசை பாதுகாக்கப்பட்டது",
        "voiceOutput": "குரல் வெளியீடு",
        "voiceOutputDesc": "பின்தோன்றல் முடிவுகளின் குரல் விவரணையை இயக்கவும் அல்லது முடக்கவும்",
        "voiceLang": "குரல் மொழி",
        "voiceLangDesc": "குரல் விவரணை இடைமுக மொழி அமைப்பைப் பின்பற்றுகிறது",
        "reducedMotion": "குறைக்கப்பட்ட இயக்கம்",
        "reducedMotionDesc": "பயன்பாடு முழுவதும் அனிமேஷன்கள் மற்றும் மாற்றங்களைக் குறைக்கவும்"
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
