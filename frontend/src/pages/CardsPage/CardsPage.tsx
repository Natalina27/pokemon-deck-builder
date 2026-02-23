import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { SearchBar } from '../../components'
import { useCards } from '../../hooks'
import '../../web-components/pokemon-card'
import '../../types/custom-elements-jsx'
import styles from './CardsPage.module.css'

const CARD_MIN_WIDTH = 150
const CARD_MIN_WIDTH_MOBILE = 120
const GAP = 12
const CARD_ASPECT_RATIO = 3.5 / 2.5
const PAGINATION_HEIGHT = 100

function computePageSize(gridWidth: number, gridTop: number): number {
  const minCard = gridWidth < 600 ? CARD_MIN_WIDTH_MOBILE : CARD_MIN_WIDTH
  const columns = Math.max(1, Math.floor((gridWidth + GAP) / (minCard + GAP)))
  const cardWidth = (gridWidth - (columns - 1) * GAP) / columns
  const cardHeight = cardWidth * CARD_ASPECT_RATIO
  const availableHeight = window.innerHeight - gridTop - PAGINATION_HEIGHT
  const rows = Math.max(1, Math.floor(availableHeight / (cardHeight + GAP)))
  return columns * rows
}

const CardsPage = () => {
  const { cards, loading, error, rarities, types, selectedRarity, selectedType, setSelectedRarity, setSelectedType } = useCards()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const gridRef = useRef<HTMLDivElement>(null)

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize))
  const start = (page - 1) * pageSize
  const paginatedCards = filteredCards.slice(start, start + pageSize)

  useLayoutEffect(() => {
    if (loading || error || !gridRef.current) return
    const update = () => {
      if (!gridRef.current) return
      const rect = gridRef.current.getBoundingClientRect()
      setPageSize(computePageSize(rect.width, rect.top))
    }
    update()
    window.addEventListener('resize', update)
    const ro = new ResizeObserver(update)
    ro.observe(gridRef.current)
    return () => {
      window.removeEventListener('resize', update)
      ro.disconnect()
    }
  }, [loading, error])

  useEffect(() => {
    setPage(1)
  }, [search, selectedRarity, selectedType])

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  const SKELETON_COUNT = 12

  if (error) return <p>Error: {error.message}</p>

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <SearchBar value={search} onChange={setSearch} />
        <select
          className={styles.select}
          value={selectedRarity}
          onChange={e => setSelectedRarity(e.target.value)}
          disabled={loading}
        >
          <option value="">All rarities</option>
          {rarities.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          className={styles.select}
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          disabled={loading}
        >
          <option value="">All types</option>
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <p className={styles.count}>
        {loading
          ? 'Loading…'
          : `${filteredCards.length} card${filteredCards.length !== 1 ? 's' : ''}${totalPages > 1 ? ` · Page ${page} of ${totalPages}` : ''}`}
      </p>
      <div ref={gridRef} className={styles.grid}>
        {loading
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <div key={i} className={styles.skeleton} aria-hidden />
            ))
          : paginatedCards.map((card, index) => (
              <pokemon-card
                key={card.id}
                name={card.name}
                image={`${card.image}/high.webp`}
                style={{
                  display: 'block',
                  animationDelay: `${index * 0.04}s`,
                }}
                className={`${styles.card} ${styles.cardReveal}`}
              />
            ))}
      </div>
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Cards pagination">
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => setPage(1)}
            aria-label="First page"
          >
            First
          </button>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page >= totalPages}
            onClick={() => setPage(totalPages)}
            aria-label="Last page"
          >
            Last
          </button>
        </nav>
      )}
    </div>
  )
}

export default CardsPage