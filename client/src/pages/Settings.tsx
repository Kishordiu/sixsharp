import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Palette, Globe, FlaskConical, Bot, Volume2, Shield, Eye } from 'lucide-react'
import { useMode } from '@/app/providers/ModeProvider'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/app/providers/ToastProvider'

const SECTIONS = [
  { id: 'appearance', labelKey: 'settings.appearance', icon: Palette },
  { id: 'language', labelKey: 'settings.language', icon: Globe },
  { id: 'research', labelKey: 'settings.researchDefaults', icon: FlaskConical },
  { id: 'ai', labelKey: 'settings.aiAssistant', icon: Bot },
  { id: 'voice', labelKey: 'settings.voice', icon: Volume2 },
  { id: 'accessibility', labelKey: 'settings.accessibility', icon: Eye },
]

export default function Settings() {
  const [activeSection, setActiveSection] = useState('appearance')
  const { mode, toggleMode } = useMode()
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const toast = useToast()

  // Research defaults stored in localStorage
  const [riskFreeRate, setRiskFreeRate] = useState(() => Number(localStorage.getItem('sixsharp_rfr') || '0.02'))
  const [defaultCapital, setDefaultCapital] = useState(() => Number(localStorage.getItem('sixsharp_capital') || '100000'))
  const [defaultFees, setDefaultFees] = useState(() => Number(localStorage.getItem('sixsharp_fees') || '0.001'))
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem('sixsharp_voice') !== 'false')
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('sixsharp_reduced_motion') === 'true')

  const saveSetting = (key: string, value: string, settingName: string) => {
    localStorage.setItem(key, value)
    toast(`${settingName} saved successfully`, 'success')
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full">
      {/* Section Navigation */}
      <div className="lg:w-64 shrink-0">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-3 mb-6">
          <SettingsIcon className="text-[var(--color-accent-blue)]" />
          {t('settings.title')}
        </h1>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <section.icon size={18} />
              {t(section.labelKey)}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 space-y-6"
      >
        {activeSection === 'appearance' && (
          <SettingsSection title={t('settings.appearance')} description="Customize the look and feel of SIXSHARP">
            <SettingRow
              title={t('settings.theme')}
              description={t('settings.themeDesc')}
            >
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    theme === 'dark'
                      ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    theme === 'light'
                      ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
                  }`}
                >
                  Light
                </button>
              </div>
            </SettingRow>
            <SettingRow
              title={t('settings.interfaceMode')}
              description={t('settings.interfaceModeDesc')}
            >
              <button
                onClick={toggleMode}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  mode === 'pro'
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                    : 'border-purple-500 bg-purple-500/10 text-purple-400'
                }`}
              >
                {mode === 'pro' ? 'PRO' : 'BEGINNER'}
              </button>
            </SettingRow>
          </SettingsSection>
        )}

        {activeSection === 'language' && (
          <SettingsSection title={t('settings.language')} description={t('settings.interfaceLangDesc')}>
            <SettingRow title={t('settings.interfaceLang')} description={t('settings.interfaceLangDesc')}>
              <div className="flex gap-3">
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    i18n.language.startsWith('en')
                      ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => i18n.changeLanguage('ta')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    i18n.language.startsWith('ta')
                      ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </SettingRow>
          </SettingsSection>
        )}

        {activeSection === 'research' && (
          <SettingsSection title={t('settings.researchDefaults')} description={t('settings.interfaceLangDesc')}>
            <SettingRow title={t('settings.riskFreeRate')} description={t('settings.riskFreeRateDesc')}>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={riskFreeRate}
                  onChange={e => { setRiskFreeRate(Number(e.target.value)); saveSetting('sixsharp_rfr', e.target.value, 'Risk-Free Rate') }}
                  className="w-24 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] font-mono text-right focus:outline-none focus:border-[var(--color-accent-blue)]"
                />
                <span className="text-sm text-[var(--color-text-muted)]">({(riskFreeRate * 100).toFixed(1)}%)</span>
              </div>
            </SettingRow>
            <SettingRow title={t('settings.defaultCapital')} description={t('settings.defaultCapitalDesc')}>
              <input
                type="number"
                value={defaultCapital}
                onChange={e => { setDefaultCapital(Number(e.target.value)); saveSetting('sixsharp_capital', e.target.value, 'Default Capital') }}
                className="w-32 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] font-mono text-right focus:outline-none focus:border-[var(--color-accent-blue)]"
              />
            </SettingRow>
            <SettingRow title={t('settings.defaultTxCost')} description={t('settings.defaultTxCostDesc')}>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.0001"
                  value={defaultFees}
                  onChange={e => { setDefaultFees(Number(e.target.value)); saveSetting('sixsharp_fees', e.target.value, 'Transaction Cost') }}
                  className="w-24 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] font-mono text-right focus:outline-none focus:border-[var(--color-accent-blue)]"
                />
                <span className="text-sm text-[var(--color-text-muted)]">({(defaultFees * 100).toFixed(2)}%)</span>
              </div>
            </SettingRow>
          </SettingsSection>
        )}

        {activeSection === 'ai' && (
          <SettingsSection title={t('settings.aiAssistant')} description={t('settings.interfaceLangDesc')}>
            <SettingRow title={t('settings.aiModel')} description={t('settings.aiModelDesc')}>
              <span className="text-sm font-mono text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)] px-3 py-2 rounded-lg border border-[var(--color-border)]">
                meta-llama/Meta-Llama-3-70B-Instruct
              </span>
            </SettingRow>
            <SettingRow title={t('settings.aiProvider')} description={t('settings.aiProviderDesc')}>
              <span className="text-sm text-[var(--color-text-secondary)]">Featherless AI (Server-proxied)</span>
            </SettingRow>
            <SettingRow title={t('settings.aiSecurity')} description={t('settings.aiSecurityDesc')}>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[var(--color-accent-green)]" />
                <span className="text-sm text-[var(--color-accent-green)]">{t('settings.keySecured')}</span>
              </div>
            </SettingRow>
          </SettingsSection>
        )}

        {activeSection === 'voice' && (
          <SettingsSection title={t('settings.voice')} description={t('settings.interfaceLangDesc')}>
            <SettingRow title={t('settings.voiceOutput')} description={t('settings.voiceOutputDesc')}>
              <ToggleSwitch
                enabled={voiceEnabled}
                onChange={(val) => { setVoiceEnabled(val); saveSetting('sixsharp_voice', String(val), 'Voice Synthesis') }}
              />
            </SettingRow>
            <SettingRow title={t('settings.voiceLang')} description={t('settings.voiceLangDesc')}>
              <span className="text-sm text-[var(--color-text-secondary)]">{i18n.language.startsWith('ta') ? 'தமிழ் (Tamil)' : 'English'}</span>
            </SettingRow>
          </SettingsSection>
        )}

        {activeSection === 'accessibility' && (
          <SettingsSection title={t('settings.accessibility')} description={t('settings.interfaceLangDesc')}>
            <SettingRow title={t('settings.reducedMotion')} description={t('settings.reducedMotionDesc')}>
              <ToggleSwitch
                enabled={reducedMotion}
                onChange={(val) => { setReducedMotion(val); saveSetting('sixsharp_reduced_motion', String(val), 'Reduced Motion') }}
              />
            </SettingRow>
          </SettingsSection>
        )}
      </motion.div>
    </div>
  )
}

// Reusable components for settings layout
function SettingsSection({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[var(--color-border)]">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{title}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{description}</p>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {children}
      </div>
    </div>
  )
}

function SettingRow({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-[var(--color-text-primary)]">{title}</h3>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean, onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
        enabled ? 'bg-[var(--color-accent-blue)]' : 'bg-[var(--color-bg-elevated)] border border-[var(--color-border)]'
      }`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
        enabled ? 'translate-x-6' : 'translate-x-0.5'
      }`} />
    </button>
  )
}
