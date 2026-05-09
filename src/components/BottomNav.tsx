import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Search, BarChart2, ShoppingCart, User } from 'lucide-react'

const links = [
  { to: '/',        icon: Search,       key: 'nav.explore'  },
  { to: '/compare', icon: BarChart2,    key: 'nav.compare'  },
  { to: '/lists',   icon: ShoppingCart, key: 'nav.lists'    },
  { to: '/profile', icon: User,         key: 'nav.profile'  },
]

export default function BottomNav() {
  const { t } = useTranslation()
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden"
      style={{ background: 'var(--bg-nav)', borderTop: '1px solid var(--border)' }}
      aria-label={t('nav.explore')}
    >
      {links.map(({ to, icon: Icon, key }) => (
        <NavLink
          key={to} to={to} end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              isActive ? 'text-[var(--accent)]' : 'text-[var(--text-3)] hover:text-[var(--text-2)]'
            }`
          }
        >
          <Icon size={20} strokeWidth={1.5} />
          <span>{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
