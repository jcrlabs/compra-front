import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Plus, Share2 } from 'lucide-react'
import { Link } from 'react-router'
import { api } from '../api/client'
import toast from 'react-hot-toast'

interface ShoppingList { id: string; name: string; share_token: string; updated_at: string }

export default function ListsPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [newName, setNewName] = useState('')

  const { data: lists = [] } = useQuery<ShoppingList[]>({
    queryKey: ['lists'],
    queryFn: () => api.get('/lists').then(r => r.data),
  })

  const create = useMutation({
    mutationFn: (name: string) => api.post('/lists', { name }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lists'] })
      setNewName('')
      toast.success(t('lists.created'))
    },
    onError: () => toast.error(t('common.error')),
  })

  const copyShare = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${token}`)
    toast.success(t('common.copied'))
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-1)' }}>{t('lists.title')}</h1>

      {/* New list */}
      <form onSubmit={e => { e.preventDefault(); if (newName.trim()) create.mutate(newName.trim()) }}
        className="flex gap-2 mb-6">
        <input value={newName} onChange={e => setNewName(e.target.value)}
          placeholder={t('lists.new')} className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-md)', color: 'var(--text-1)' }} />
        <button type="submit" disabled={!newName.trim()} aria-label={t('lists.new')}
          className="p-2.5 rounded-lg disabled:opacity-40" style={{ background: 'var(--accent)', color: '#fff' }}>
          <Plus size={18} />
        </button>
      </form>

      {lists.length === 0
        ? <p className="text-center py-12 text-sm" style={{ color: 'var(--text-3)' }}>{t('lists.empty')}</p>
        : <div className="space-y-2">
            {lists.map((l) => (
              <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Link to={`/lists/${l.id}`} className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>{l.name}</p>
                </Link>
                <button onClick={() => copyShare(l.share_token)} aria-label={t('lists.share')}
                  className="p-2 rounded-lg transition-colors hover:opacity-70" style={{ color: 'var(--text-3)' }}>
                  <Share2 size={16} />
                </button>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
