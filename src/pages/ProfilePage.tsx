import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { useMutation } from '@tanstack/react-query'
import { api } from '../api/client'
import { Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'
import i18n from '../i18n'

const SUPERMARKETS = ['mercadona','froiz','alcampo','eroski'] as const
const SUPER_COLORS: Record<string, string> = {
  mercadona:'#00a651',froiz:'#ed1c24',alcampo:'#003da5',eroski:'#e30613'
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const { user, clearAuth } = useAuthStore()
  const { theme, toggleTheme, locale, setLocale } = useSettingsStore()

  const logout = useMutation({
    mutationFn: () => Promise.resolve(),
    onSuccess: () => clearAuth(),
  })

  const savePrefs = useMutation({
    mutationFn: (prefs: Record<string,boolean>) => api.put('/preferences/supermarkets', { supermarkets: prefs }),
    onSuccess: () => toast.success(t('common.save')),
  })

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      {/* User */}
      <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="font-medium" style={{ color: 'var(--text-1)' }}>{user?.name}</p>
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>{user?.email}</p>
      </div>

      {/* Theme */}
      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-2)' }}>{t('settings.theme')}</h2>
        <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-1)' }}>
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          {theme === 'dark' ? t('settings.dark') : t('settings.light')}
        </button>
      </div>

      {/* Language */}
      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-2)' }}>{t('settings.language')}</h2>
        <div className="flex gap-2">
          {(['es','en','gl'] as const).map(l => (
            <button key={l} onClick={() => { setLocale(l); i18n.changeLanguage(l) }}
              className="px-4 py-1.5 rounded-lg text-sm font-medium"
              style={{ background: locale === l ? 'var(--accent)' : 'var(--bg-card)', color: locale === l ? '#fff' : 'var(--text-2)', border: '1px solid var(--border)' }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Supermarket prefs */}
      <div>
        <h2 className="text-sm font-medium mb-1" style={{ color: 'var(--text-2)' }}>{t('prefs.title')}</h2>
        <p className="text-xs mb-3" style={{ color: 'var(--text-3)' }}>{t('prefs.desc')}</p>
        <div className="grid grid-cols-2 gap-2">
          {SUPERMARKETS.map(s => (
            <label key={s} className="flex items-center gap-2 p-2.5 rounded-xl cursor-pointer"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: SUPER_COLORS[s] }} />
              <span className="text-sm capitalize flex-1" style={{ color: 'var(--text-1)' }}>{s}</span>
              <input type="checkbox" defaultChecked className="accent-[var(--accent)]"
                onChange={e => savePrefs.mutate({ [s]: e.target.checked })} />
            </label>
          ))}
        </div>
      </div>

      <button onClick={() => logout.mutate()}
        className="w-full py-2.5 rounded-xl text-sm font-medium"
        style={{ background: 'var(--bg-card)', color: '#ef4444', border: '1px solid var(--border)' }}>
        {t('auth.logout')}
      </button>
    </div>
  )
}
