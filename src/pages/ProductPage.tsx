import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, ExternalLink } from 'lucide-react'
import { api } from '../api/client'
import toast from 'react-hot-toast'

const SUPER_COLORS: Record<string, string> = {
  mercadona: '#00a651', froiz: '#ed1c24', gadis: '#009639',
  carrefour: '#004e9a', alcampo: '#003da5', eroski: '#e30613',
}

interface Price { supermarket: string; price: number; price_per_unit?: number; external_url: string }

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()

  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then(r => r.data),
  })

  const { data: prices } = useQuery<Price[]>({
    queryKey: ['prices', id],
    queryFn: () => api.get(`/products/${id}/prices`).then(r => r.data),
    enabled: !!id,
  })

  const sorted = [...(prices ?? [])].sort((a, b) => a.price - b.price)
  const cheapest = sorted[0]

  const addToList = () => toast(t('lists.addItem'), { icon: '🛒' })

  if (!product) return <div className="p-4 animate-pulse"><div className="h-8 rounded w-2/3" style={{ background: 'var(--bg-card)' }} /></div>

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex gap-4 mb-6">
        {product.image_url
          ? <img src={product.image_url} alt={product.name} className="w-24 h-24 object-contain rounded-xl" style={{ background: 'var(--bg-card)' }} />
          : <div className="w-24 h-24 rounded-xl" style={{ background: 'var(--bg-card)' }} />}
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-1)' }}>{product.name}</h1>
          {product.brand && <p className="text-sm" style={{ color: 'var(--text-3)' }}>{product.brand}</p>}
          <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>{product.unit_quantity} {product.unit}</p>
        </div>
      </div>

      {cheapest && (
        <div className="flex items-center justify-between p-3 rounded-xl mb-4" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            {t('pricing.cheapest')}: {cheapest.supermarket} — {cheapest.price.toFixed(2)} €
          </span>
          <button onClick={addToList} aria-label={t('lists.addItem')}
            className="p-2 rounded-lg transition-colors hover:opacity-80" style={{ background: 'var(--accent)', color: '#fff' }}>
            <ShoppingCart size={16} />
          </button>
        </div>
      )}

      <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-2)' }}>{t('pricing.prices')}</h2>
      <div className="space-y-2">
        {sorted.map((p) => (
          <div key={p.supermarket} className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: SUPER_COLORS[p.supermarket] || '#888' }} />
              <div>
                <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-1)' }}>{p.supermarket}</p>
                {p.price_per_unit && (
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>{p.price_per_unit.toFixed(3)} €/{t('pricing.perUnit')}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{p.price.toFixed(2)} €</span>
              {p.external_url && (
                <a href={p.external_url} target="_blank" rel="noopener noreferrer" aria-label="Ver en tienda"
                  className="p-1.5 rounded-lg" style={{ color: 'var(--text-3)' }}>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
