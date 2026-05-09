import { Outlet } from 'react-router'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen pb-16 md:pb-0 md:pl-56" style={{ background: 'var(--bg-base)' }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        style={{ background: 'var(--accent)', color: '#fff' }}>
        Saltar al contenido
      </a>
      <main id="main" className="animate-slide-up">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
