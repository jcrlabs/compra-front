import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router'
import { api } from '../api/client'
import { useAuthStore } from '../store/authStore'

interface Form { name: string; email: string; password: string }

export default function RegisterPage() {
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors } } = useForm<Form>()
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: Form) => api.post('/auth/register', data).then(r => r.data),
    onSuccess: (data) => { setAuth(data.token, data.user); navigate('/') },
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-sm animate-scale-in">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-1)' }}>{t('auth.registerTitle')}</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-3)' }}>{t('app.name')}</p>

        <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-2)' }}>{t('auth.name')}</label>
            <input type="text" autoComplete="name" {...register('name', { required: true })}
              className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-md)', color: 'var(--text-1)' }} />
            {errors.name && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{t('common.required')}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-2)' }}>{t('auth.email')}</label>
            <input type="email" autoComplete="email" {...register('email', { required: true })}
              className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-md)', color: 'var(--text-1)' }} />
            {errors.email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{t('common.required')}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-2)' }}>{t('auth.password')}</label>
            <input type="password" autoComplete="new-password" {...register('password', { required: true, minLength: 8 })}
              className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-md)', color: 'var(--text-1)' }} />
            {errors.password && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                {errors.password.type === 'minLength' ? t('auth.passwordMin') : t('common.required')}
              </p>
            )}
          </div>
          {error && <p className="text-xs" style={{ color: '#ef4444' }}>{t('common.error')}</p>}
          <button type="submit" disabled={isPending}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            {isPending ? t('common.loading') : t('auth.register')}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-3)' }}>
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="font-medium" style={{ color: 'var(--accent)' }}>{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  )
}
