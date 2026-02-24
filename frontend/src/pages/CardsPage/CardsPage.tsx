import { useState, useLayoutEffect, useRef } from 'react'
import { SearchBar, Pagination } from '../../components'
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
  const {
    cards,
    loading,
    error,
    rarities,
    types,
    selectedRarity,
    selectedType,
    setSelectedRarity,
    setSelectedType,
  } = useCards()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const gridRef = useRef<HTMLDivElement>(null)

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize))
  const clampedPage = Math.min(page, totalPages)
  const start = (clampedPage - 1) * pageSize
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

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRarityChange = (value: string) => {
    setSelectedRarity(value)
    setPage(1)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    setPage(1)
  }

  const handleClearFilters = () => {
    setSearch('')
    setSelectedRarity('')
    setSelectedType('')
    setPage(1)
  }

  const SKELETON_COUNT = 12

  if (error) return <p>Error: {error.message}</p>

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <SearchBar value={search} onChange={handleSearchChange} />
        <select
          className={styles.select}
          value={selectedRarity}
          onChange={(e) => handleRarityChange(e.target.value)}
          disabled={loading}
        >
          <option value="">All rarities</option>
          {rarities.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          disabled={loading}
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {(search || selectedRarity || selectedType) && (
          <button
            type="button"
            className={styles.clearFilters}
            onClick={handleClearFilters}
            disabled={loading}
          >
            Clear filters
          </button>
        )}
      </div>
      <p className={styles.count}>
        {loading
          ? 'Loading…'
          : `${filteredCards.length} card${filteredCards.length !== 1 ? 's' : ''}${totalPages > 1 ? ` · Page ${clampedPage} of ${totalPages}` : ''}`}
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
      <Pagination
        page={clampedPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}

export default CardsPage
