import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { api } from '../api/client'
import { Link } from 'react-router'
import useDebounce from '../hooks/useDebounce'

interface Product { id: string; name: string; brand: string; unit: string; unit_quantity: number; image_url: string }
interface Category { id: string; name: string; slug: string; icon: string }

export default function ExplorePage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 350)

  const { data: cats } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['products', debouncedSearch, categoryId, page],
    queryFn: () => api.get('/products', { params: { search: debouncedSearch, category_id: categoryId || undefined, page, limit: 40 } }).then(r => r.data),
  })

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
        <input
          type="search" placeholder={t('catalog.search')} value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          aria-label={t('catalog.search')}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <button onClick={() => { setCategoryId(''); setPage(1) }}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${!categoryId ? 'text-[var(--bg-base)]' : ''}`}
          style={{ background: !categoryId ? 'var(--accent)' : 'var(--bg-card)', color: !categoryId ? '#fff' : 'var(--text-2)' }}>
          {t('catalog.allCategories')}
        </button>
        {cats?.map(c => (
          <button key={c.id} onClick={() => { setCategoryId(c.id); setPage(1) }}
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
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>{p.name}</p>
                {p.brand && <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{p.brand}</p>}
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{p.unit_quantity} {p.unit}</p>
              </div>
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
