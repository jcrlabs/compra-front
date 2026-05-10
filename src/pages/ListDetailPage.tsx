import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Check } from 'lucide-react'
import { api } from '../api/client'

interface ListItem { id: string; name: string; quantity: number; checked: boolean; notes?: string }
interface ShoppingList { id: string; name: string; share_token: string; items: ListItem[] }

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [newItem, setNewItem] = useState('')

  const { data: list } = useQuery<ShoppingList>({
    queryKey: ['list', id],
    queryFn: () => api.get(`/lists/${id}`).then(r => r.data),
  })

  // SSE — real-time shared list updates
  useEffect(() => {
    if (!id) return
    const token = localStorage.getItem('token')
    const apiBase = import.meta.env.VITE_API_URL || ''
    const es = new EventSource(`${apiBase}/api/v1/lists/${id}/events?token=${token}`)
    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data)
        if (['item_added','item_updated','item_deleted','list_updated'].includes(event.type)) {
          qc.invalidateQueries({ queryKey: ['list', id] })
        }
      } catch { /* ignore */ }
    }
    return () => es.close()
  }, [id, qc])

  const addItem = useMutation({
    mutationFn: (name: string) => api.post(`/lists/${id}/items`, { name, quantity: 1 }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['list', id] }); setNewItem('') },
  })

  const toggleItem = useMutation({
    mutationFn: (item: ListItem) => api.put(`/lists/${id}/items/${item.id}`, { ...item, checked: !item.checked }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['list', id] }),
  })

  const deleteItem = useMutation({
    mutationFn: (itemId: string) => api.delete(`/lists/${id}/items/${itemId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['list', id] }),
  })

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-1)' }}>{list?.name}</h1>

      <form onSubmit={e => { e.preventDefault(); if (newItem.trim()) addItem.mutate(newItem.trim()) }}
        className="flex gap-2 mb-4">
        <input value={newItem} onChange={e => setNewItem(e.target.value)}
          placeholder={t('lists.addItem')} className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-md)', color: 'var(--text-1)' }} />
        <button type="submit" disabled={!newItem.trim()} aria-label={t('lists.addItem')}
          className="p-2.5 rounded-lg disabled:opacity-40" style={{ background: 'var(--accent)', color: '#fff' }}>
          <Plus size={18} />
        </button>
      </form>

      <div className="space-y-2">
        {list?.items?.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', opacity: item.checked ? 0.5 : 1 }}>
            <button onClick={() => toggleItem.mutate(item)} aria-label="toggle"
              className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors"
              style={{ background: item.checked ? 'var(--accent)' : 'var(--bg-input)', border: '2px solid var(--border-md)' }}>
              {item.checked && <Check size={12} color="#fff" />}
            </button>
            <span className="flex-1 text-sm" style={{ color: 'var(--text-1)', textDecoration: item.checked ? 'line-through' : 'none' }}>
              {item.name}
            </span>
            <button onClick={() => deleteItem.mutate(item.id)} aria-label={t('common.delete')}
              className="p-1.5 rounded transition-colors hover:opacity-70" style={{ color: 'var(--text-3)' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
