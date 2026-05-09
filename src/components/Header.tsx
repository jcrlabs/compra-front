import { Sun, Moon } from 'lucide-react'
import { useSettingsStore } from '../store/settingsStore'
import i18n from '../i18n'

const LOCALES = ['gl', 'es', 'en'] as const

export default function Header() {
  const { theme, toggleTheme, locale, setLocale } = useSettingsStore()

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 h-11"
      style={{ background: 'var(--bg-nav)', borderBottom: '1px solid var(--border)' }}
    >
      <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--accent)' }}>
        Compra
      </span>
      <div className="flex items-center gap-1">
        {LOCALES.map(l => (
          <button
            key={l}
            onClick={() => { setLocale(l); i18n.changeLanguage(l) }}
            className="px-2 py-0.5 rounded text-xs font-medium transition-colors"
            style={{
              background: locale === l ? 'var(--accent)' : 'transparent',
              color: locale === l ? '#fff' : 'var(--text-3)',
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
        <button
          onClick={toggleTheme}
          aria-label="toggle theme"
          className="ml-1 p-1.5 rounded transition-colors hover:opacity-70"
          style={{ color: 'var(--text-2)' }}
        >
          {theme === 'dark' ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
        </button>
      </div>
    </header>
  )
}
