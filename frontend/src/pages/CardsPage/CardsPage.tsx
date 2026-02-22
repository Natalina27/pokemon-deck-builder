import { useState } from 'react'
import { SearchBar } from '../../components'
import { useCards } from '../../hooks'
import '../../web-components/pokemon-card'
import '../../types/custom-elements-jsx'
import styles from './CardsPage.module.css'

const CardsPage = () => {
  const { cards, loading, error } = useCards()
  const [search, setSearch] = useState('')

const filteredCards = cards.filter(card =>
  card.name.toLowerCase().includes(search.toLowerCase())
)

  if (loading) return <div>Loading...</div>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className={styles.container}>
      <SearchBar value={search} onChange={setSearch} />
      <div className={styles.grid}>
        {filteredCards.map((card) => (
          <pokemon-card 
            key={card.id} 
            name={card.name} 
            image={`${card.image}/high.webp`} 
            style={{display: 'block'}}
            className={styles.card}
          />
        ))}
      </div>
    </div>
  );
};

export default CardsPage;