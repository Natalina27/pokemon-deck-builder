import { useState } from 'react'
import { SearchBar } from '../../components'
import { useCards } from '../../hooks'
import '../../web-components/pokemon-card'
import '../../types/custom-elements-jsx'
import styles from './CardsPage.module.css'

const CardsPage = () => {
  const { cards, loading, error, rarities, types, selectedRarity, selectedType, setSelectedRarity, setSelectedType } = useCards()
  const [search, setSearch] = useState('')

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div>Loading...</div>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <SearchBar value={search} onChange={setSearch} />
        <select
          className={styles.select}
          value={selectedRarity}
          onChange={e => setSelectedRarity(e.target.value)}
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
        >
          <option value="">All types</option>
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className={styles.grid}>
        {filteredCards.map((card) => (
          <pokemon-card
            key={card.id}
            name={card.name}
            image={`${card.image}/high.webp`}
            style={{ display: 'block' }}
            className={styles.card}
          />
        ))}
      </div>
    </div>
  )
}

export default CardsPage