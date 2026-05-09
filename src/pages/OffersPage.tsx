import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Tag } from 'lucide-react'
import { api } from '../api/client'

interface Offer {
  product_id: string
  name: string
  brand?: string
  image_url?: string
  unit: string
  unit_quantity: number
  supermarket: string
  current_price: number
  avg_price: number
  discount_pct: number
}

const SUPER_COLORS: Record<string, string> = {
  mercadona: '#00a651', froiz: '#ed1c24', gadis: '#009639',
  carrefour: '#004e9a', alcampo: '#003da5', eroski: '#e30613',
}

export default function OffersPage() {
  const { t } = useTranslation()

  const { data: offers = [], isLoading } = useQuery<Offer[]>({
    queryKey: ['offers'],
    queryFn: () => api.get('/offers').then(r => r.data),
  })

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Tag size={16} style={{ color: 'var(--accent)' }} />
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-1)' }}>{t('offers.title')}</h1>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: 'var(--bg-card)' }} />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>{t('offers.empty')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {offers.map((offer, i) => (
            <Link
              key={`${offer.product_id}-${offer.supermarket}-${i}`}
              to={`/products/${offer.product_id}`}
              className="flex items-center gap-3 p-3 rounded-xl transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              {offer.image_url
                ? <img src={offer.image_url} alt={offer.name} className="w-14 h-14 object-contain rounded-lg shrink-0" style={{ background: 'var(--bg-surface)' }} />
                : <div className="w-14 h-14 rounded-lg shrink-0" style={{ background: 'var(--bg-surface)' }} />
              }
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>{offer.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: SUPER_COLORS[offer.supermarket] ?? '#888' }} />
                  <span className="text-xs capitalize" style={{ color: 'var(--text-3)' }}>{offer.supermarket}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                  {offer.current_price.toFixed(2)} €
                </p>
                {offer.discount_pct > 0 && (
                  <>
                    <p className="text-xs line-through" style={{ color: 'var(--text-3)' }}>
                      {offer.avg_price.toFixed(2)} €
                    </p>
                    <p className="text-xs font-medium" style={{ color: '#ef4444' }}>
                      -{offer.discount_pct}%
                    </p>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
