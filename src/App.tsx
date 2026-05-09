import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { lazy, Suspense } from 'react'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'

const ExplorePage    = lazy(() => import('./pages/ExplorePage'))
const OffersPage     = lazy(() => import('./pages/OffersPage'))
const ProductPage    = lazy(() => import('./pages/ProductPage'))
const ListsPage      = lazy(() => import('./pages/ListsPage'))
const ListDetailPage = lazy(() => import('./pages/ListDetailPage'))
const ProfilePage    = lazy(() => import('./pages/ProfilePage'))
const LoginPage      = lazy(() => import('./pages/LoginPage'))
const RegisterPage   = lazy(() => import('./pages/RegisterPage'))
const JoinListPage   = lazy(() => import('./pages/JoinListPage'))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000 } },
})

function Protected({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore((s) => s.isAuthenticated)
  return auth ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const auth = useAuthStore((s) => s.isAuthenticated)
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/login"       element={auth ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/register"    element={auth ? <Navigate to="/" replace /> : <RegisterPage />} />
            <Route path="/join/:token" element={<JoinListPage />} />
            <Route element={<Protected><Layout /></Protected>}>
              <Route index               element={<ExplorePage />} />
              <Route path="/offers"      element={<OffersPage />} />
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/lists"       element={<ListsPage />} />
              <Route path="/lists/:id"   element={<ListDetailPage />} />
              <Route path="/profile"     element={<ProfilePage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        style: { background: 'var(--bg-card)', color: 'var(--text-1)', border: '1px solid var(--border-md)' }
      }} />
    </QueryClientProvider>
  )
}
