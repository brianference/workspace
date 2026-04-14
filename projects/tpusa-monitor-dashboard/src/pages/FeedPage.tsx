import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { EventItem } from '../components/EventItem'
import { SkeletonFeed } from '../components/SkeletonFeed'
import { Toast } from '../components/Toast'
import { FAB } from '../components/FAB'
import { BottomNav } from '../components/BottomNav'
import { IS_MOCK_MODE } from '../lib/supabase'
import { getLatestSweep, getAllFlaggedPosts, subscribeToNewSweeps } from '../lib/api'
import { MOCK_SWEEPS, MOCK_POSTS } from '../lib/mockData'
import type { Sweep, FlaggedPost } from '../lib/types'

type CategoryFilter = 'all' | 'legal' | 'mention' | 'org' | 'video'
type SortMode = 'newest' | 'oldest' | 'legal-first' | 'video-first'

const FILTER_LABELS: { key: CategoryFilter; label: string; color?: string }[] = [
  { key: 'all',     label: 'All'     },
  { key: 'legal',   label: 'Legal',   color: 'var(--danger)' },
  { key: 'mention', label: 'Mention', color: 'var(--warn)'   },
  { key: 'org',     label: 'Org',     color: 'var(--accent)' },
  { key: 'video',   label: '▶ Video', color: 'var(--accent)' },
]

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'newest',      label: 'Newest'      },
  { key: 'oldest',      label: 'Oldest'      },
  { key: 'legal-first', label: 'Legal first' },
  { key: 'video-first', label: 'Video first' },
]

const CATEGORY_PRIORITY: Record<string, number> = { legal: 0, mention: 1, org: 2, flag: 3 }

const HIDDEN_HANDLES = new Set(['swordtruth'])

/** Client-side re-sort */
function applySortMode(posts: FlaggedPost[], mode: SortMode): FlaggedPost[] {
  if (mode === 'legal-first') {
    return [...posts].sort(
      (a, b) => (CATEGORY_PRIORITY[a.category] ?? 9) - (CATEGORY_PRIORITY[b.category] ?? 9)
    )
  }
  if (mode === 'video-first') {
    return [...posts].sort((a, b) => {
      const aV = a.media_type === 'video' ? 0 : 1
      const bV = b.media_type === 'video' ? 0 : 1
      return aV - bV
    })
  }
  return posts
}

/**
 * Main feed page: searchable, filterable, sortable infinite-scroll list
 * of all flagged posts across every sweep.
 */
export function FeedPage() {
  const navigate = useNavigate()
  const [sweep, setSweep] = useState<Sweep | null>(null)
  const [posts, setPosts] = useState<FlaggedPost[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<CategoryFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showMedia, setShowMedia] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const queryRef = useRef(query)
  const filterRef = useRef(filter)
  const sortRef = useRef(sortMode)
  queryRef.current = query
  filterRef.current = filter
  sortRef.current = sortMode

  const loadPage = useCallback(async (
    pageIndex: number,
    currentQuery: string,
    currentFilter: CategoryFilter,
    currentSort: SortMode
  ) => {
    if (IS_MOCK_MODE) {
      let filtered = MOCK_POSTS
      if (currentQuery.trim()) {
        const q = currentQuery.toLowerCase()
        filtered = filtered.filter(
          (p) => p.handle.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
        )
      }
      if (currentFilter !== 'all') filtered = filtered.filter((p) => p.category === currentFilter)
      setPosts(applySortMode(filtered, currentSort))
      setHasMore(false)
      setLoading(false)
      return
    }

    // Video filter is client-side only; category filters hit Supabase
    const categoryForQuery = (currentFilter === 'all' || currentFilter === 'video') ? '' : currentFilter
    const searchQuery = [currentQuery.trim(), categoryForQuery]
      .filter(Boolean).join(' ')
    const sortAsc = currentSort === 'oldest'

    try {
      const { posts: newPosts, hasMore: more } = await getAllFlaggedPosts(
        pageIndex, searchQuery || undefined, sortAsc
      )
      const owned = newPosts.filter((p) => !HIDDEN_HANDLES.has(p.handle.toLowerCase().replace(/^@/, '')))
      const visible = currentFilter === 'video'
        ? owned.filter((p) => p.media_type === 'video' || p.media_type === 'animated_gif')
        : currentFilter === 'all'
          ? owned
          : owned.filter((p) => p.category === currentFilter)
      const sorted = applySortMode(visible, currentSort)

      setPosts((prev) => (pageIndex === 0 ? sorted : [...prev, ...sorted]))
      setHasMore(more)
    } catch (err) {
      setToastMessage(err instanceof Error ? err.message : 'Failed to load posts')
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    if (IS_MOCK_MODE) { setSweep(MOCK_SWEEPS[0] ?? null); return }
    getLatestSweep().then(setSweep).catch(() => {})
  }, [])

  /** Reset and reload when query, filter, or sort changes */
  useEffect(() => {
    setLoading(true)
    setPosts([])
    setPage(0)
    setHasMore(true)
    const timer = setTimeout(() => {
      loadPage(0, query, filter, sortMode)
    }, query ? 300 : 0)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter, sortMode])

  useEffect(() => {
    if (IS_MOCK_MODE) return
    const unsubscribe = subscribeToNewSweeps((newSweep) => {
      setSweep(newSweep)
      setToastMessage(`New sweep: ${newSweep.flag_count} flags detected`)
      setPage(0); setLoading(true); setPosts([]); setHasMore(true)
      loadPage(0, queryRef.current, filterRef.current, sortRef.current)
    })
    return unsubscribe
  }, [loadPage])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loadingMore && !loading) {
          setLoadingMore(true)
          const nextPage = page + 1
          setPage(nextPage)
          loadPage(nextPage, queryRef.current, filterRef.current, sortRef.current)
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, loading, page, loadPage])

  const handleDismissToast = useCallback(() => setToastMessage(null), [])

  return (
    <div style={{ paddingBottom: '72px' }}>
      <AppHeader sweep={sweep ?? undefined} />

      {toastMessage && <Toast message={toastMessage} onDismiss={handleDismissToast} />}

      {/* Search + filter + sort bar */}
      <div
        style={{
          padding: '0.7rem 1rem 0.5rem',
          borderBottom: '1px solid var(--sepc)',
          position: 'sticky',
          top: 0,
          background: 'var(--bg)',
          zIndex: 9,
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: '0.55rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search handles, keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search flagged posts"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '0.6rem 2.2rem 0.6rem 2.2rem',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem',
              color: 'var(--t1)', background: 'var(--card)',
              border: '1px solid var(--sepc)', borderRadius: '10px', outline: 'none',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search"
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', padding: '4px', display: 'flex', alignItems: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter pills + sort selector on same row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Category + media filter pills */}
          {FILTER_LABELS.map(({ key, label, color }) => {
            const active = filter === key
            const pillColor = color ?? 'var(--accent)'
            return (
              <button key={key} type="button" onClick={() => setFilter(key)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem',
                  fontWeight: active ? 700 : 500, padding: '4px 10px', borderRadius: '20px',
                  border: active ? `1px solid color-mix(in srgb, ${pillColor} 50%, transparent)` : '1px solid var(--sepc)',
                  background: active ? `color-mix(in srgb, ${pillColor} 14%, transparent)` : 'transparent',
                  color: active ? pillColor : 'var(--t3)',
                  cursor: 'pointer', minHeight: '30px', transition: 'all 0.1s ease', whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            )
          })}

          {/* Media toggle */}
          <button
            type="button"
            onClick={() => setShowMedia((v) => !v)}
            aria-label={showMedia ? 'Hide media' : 'Show media'}
            title={showMedia ? 'Hide media' : 'Show media'}
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem',
              fontWeight: showMedia ? 700 : 500, padding: '4px 8px', borderRadius: '20px',
              border: showMedia ? '1px solid color-mix(in srgb, var(--accent) 50%, transparent)' : '1px solid var(--sepc)',
              background: showMedia ? 'color-mix(in srgb, var(--accent) 14%, transparent)' : 'transparent',
              color: showMedia ? 'var(--accent)' : 'var(--t3)',
              cursor: 'pointer', minHeight: '30px', transition: 'all 0.1s ease', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {showMedia ? 'Media' : 'Media'}
          </button>

          {/* Sort selector -- pushed to the right */}
          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              aria-label="Sort order"
              style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem',
                fontWeight: 600, padding: '4px 24px 4px 8px', borderRadius: '8px',
                border: '1px solid var(--sepc)', background: 'var(--card)',
                color: 'var(--t2)', cursor: 'pointer', outline: 'none',
                appearance: 'none', minHeight: '30px',
              }}
            >
              {SORT_OPTIONS.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            {/* Dropdown chevron */}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Post list */}
      <div style={{ padding: '0.7rem 1rem 0.5rem' }}>
        {loading ? (
          <SkeletonFeed />
        ) : posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--t3)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', padding: '2rem 0' }}>
            {query || filter !== 'all' ? 'No results for this filter' : 'No flagged posts yet'}
          </p>
        ) : (
          <>
            <div className="post-grid">
              {posts.map((post) => <EventItem key={post.id} post={post} showMedia={showMedia} />)}
            </div>
            <div ref={sentinelRef} style={{ height: '1px' }} />
            {loadingMore && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                <LoadingDots />
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <p style={{ textAlign: 'center', color: 'var(--t4)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', padding: '0.8rem 0' }}>
                — {posts.length} results —
              </p>
            )}
          </>
        )}
      </div>

      <FAB onClick={() => {}} />
      <BottomNav active="feed" onNavigate={(tab) => {
        if (tab === 'history') navigate('/history')
        else if (tab === 'settings') navigate('/settings')
      }} />
    </div>
  )
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.6, animation: `skeleton-pulse 1.2s ease-in-out infinite ${i * 0.2}s` }} />
      ))}
    </div>
  )
}
