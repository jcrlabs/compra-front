import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { api } from '../api/client'
import { useAuthStore } from '../store/authStore'

export default function JoinListPage() {
  const { token } = useParams<{ token: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => !!s.token)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/join/${token}`, { replace: true })
    }
  }, [isAuthenticated, token, navigate])

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => api.post(`/lists/join/${token}`).then(r => r.data),
    onSuccess: (data) => navigate(`/lists/${data.list_id}`, { replace: true }),
  })

  useEffect(() => {
    if (isAuthenticated && token) mutate()
  }, [isAuthenticated, token])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center space-y-4 animate-scale-in">
        {isPending && (
          <>
            <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>{t('lists.joining')}</p>
          </>
        )}
        {isError && (
          <>
            <p className="text-sm" style={{ color: '#ef4444' }}>{t('lists.joinError')}</p>
            <button onClick={() => navigate('/lists')}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              {t('lists.goToLists')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
