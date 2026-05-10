import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { api } from '../api/client'
import { Link } from 'react-router'
import useDebounce from '../hooks/useDebounce'

interface Product { id: string; name: string; brand: string; unit: string; unit_quantity: number; image_url: string; min_price?: number; cheapest_super?: string }
interface Category { id: string; name: string; slug: string; icon: string }

const SUPERMARKETS = ['mercadona','froiz','gadis','carrefour','alcampo','eroski'] as const
const SUPER_COLORS: Record<string, string> = {
  mercadona: '#00a651', froiz: '#ed1c24', gadis: '#009639',
  carrefour: '#004e9a', alcampo: '#003da5', eroski: '#e30613',
}

export default function ExplorePage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [supermarket, setSupermarket] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 350)

  const { data: cats } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['products', debouncedSearch, categoryId, supermarket, page],
    queryFn: () => api.get('/products', {
      params: {
        search: debouncedSearch || undefined,
        category_id: categoryId || undefined,
        supermarket: supermarket || undefined,
        page,
        limit: 40,
      },
    }).then(r => r.data),
  })

  const resetPage = () => setPage(1)

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Search bar */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
        <input
          type="search" placeholder={t('catalog.search')} value={search}
          onChange={e => { setSearch(e.target.value); resetPage() }}
          aria-label={t('catalog.search')}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
        />
      </div>

      {/* Supermarket filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
        <button
          onClick={() => { setSupermarket(''); resetPage() }}
          className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
          style={{ background: !supermarket ? 'var(--accent)' : 'var(--bg-card)', color: !supermarket ? '#fff' : 'var(--text-2)' }}
        >
          {t('catalog.allSupermarkets')}
        </button>
        {SUPERMARKETS.map(s => (
          <button
            key={s}
            onClick={() => { setSupermarket(supermarket === s ? '' : s); resetPage() }}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
            style={{
              background: supermarket === s ? 'var(--accent)' : 'var(--bg-card)',
              color: supermarket === s ? '#fff' : 'var(--text-2)',
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: supermarket === s ? 'rgba(255,255,255,0.6)' : SUPER_COLORS[s] }} />
            <span className="capitalize">{s}</span>
          </button>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <button onClick={() => { setCategoryId(''); resetPage() }}
          className="shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors"
          style={{ background: !categoryId ? 'var(--accent)' : 'var(--bg-card)', color: !categoryId ? '#fff' : 'var(--text-2)' }}>
          {t('catalog.allCategories')}
        </button>
        {cats?.map(c => (
          <button key={c.id} onClick={() => { setCategoryId(c.id); resetPage() }}
            className="shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors"
            style={{ background: categoryId === c.id ? 'var(--accent)' : 'var(--bg-card)', color: categoryId === c.id ? '#fff' : 'var(--text-2)' }}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Product list */}
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: 'var(--bg-card)' }} />
        ))}</div>
      ) : data?.products?.length === 0 ? (
        <p className="text-center py-12 text-sm" style={{ color: 'var(--text-3)' }}>{t('catalog.noResults')}</p>
      ) : (
        <div className="space-y-2">
          {data?.products?.map((p: Product) => (
            <Link key={p.id} to={`/products/${p.id}`}
              className="flex items-center gap-3 p-3 rounded-xl transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {p.image_url
                ? <img src={p.image_url} alt={p.name} className="w-14 h-14 object-contain rounded-lg shrink-0" style={{ background: 'var(--bg-surface)' }} />
                : <div className="w-14 h-14 rounded-lg shrink-0" style={{ background: 'var(--bg-surface)' }} />}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>{p.name}</p>
                {p.brand && <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{p.brand}</p>}
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>{p.unit_quantity} {p.unit}</p>
              </div>
              {p.min_price != null && (
                <div className="shrink-0 text-right ml-2">
                  <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{p.min_price.toFixed(2)}€</p>
                  {p.cheapest_super && <p className="text-xs capitalize" style={{ color: 'var(--text-3)' }}>{p.cheapest_super}</p>}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.total > data?.limit && (
        <div className="flex justify-center gap-3 mt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-1.5 rounded-lg text-sm disabled:opacity-40"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)' }}>←</button>
          <span className="text-sm self-center" style={{ color: 'var(--text-3)' }}>{page}</span>
          <button disabled={page * data.limit >= data.total} onClick={() => setPage(p => p + 1)}
            className="px-4 py-1.5 rounded-lg text-sm disabled:opacity-40"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)' }}>→</button>
        </div>
      )}
    </div>
  )
}
