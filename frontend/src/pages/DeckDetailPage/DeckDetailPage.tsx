import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDeck, useCards } from '../../hooks'
import { addCardToDeck } from '../../api'
import { SearchBar } from '../../components'
import '../../web-components/pokemon-card'
import styles from './DeckDetailPage.module.css'

const DeckDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const deckId = Number(id)
  const { deck, loading, error, setDeck } = useDeck(deckId)
  const { cards } = useCards()
  const [search, setSearch] = useState('')

  const handleAddCard = async (cardId: string) => {
    await addCardToDeck(deckId, cardId)

    setDeck(prev => {
      if (!prev) return prev
      const existingCard = prev.cards?.find(c => c.id === cardId)
      if (existingCard) {
        return {
          ...prev,
          cards: prev.cards?.map(c =>
            c.id === cardId ? { ...c, quantity: (c.quantity ?? 1) + 1 } : c
          )
        }
      }
      const newCard = cards.find(c => c.id === cardId)
      if (!newCard) return prev
      return {
        ...prev,
        cards: [...(prev.cards ?? []), newCard]
      }
    })
  }

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div>Loading...</div>
  if (error) return <p>{error.message}</p>
  if (!deck) return <p>Deck not found</p>

  return (
    <div className={styles.container}>
      <h1>{deck.name}</h1>

      <div className={styles.section}>
        <h2>Cards in deck ({deck.cards?.length ?? 0})</h2>
        <div className={styles.deckCards}>
          {deck.cards?.map(card => (
            <pokemon-card
              key={card.id}
              name={card.name}
              image={`${card.image}/high.webp`}
              style={{ display: 'block' }}
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Add cards</h2>
        <SearchBar value={search} onChange={setSearch} />
        <div className={styles.grid}>
          {filteredCards.map(card => (
            <div key={card.id} className={styles.cardWrapper}>
              <pokemon-card
                name={card.name}
                image={`${card.image}/high.webp`}
                style={{ display: 'block' }}
              />
              <button
                className={styles.addButton}
                onClick={() => handleAddCard(card.id)}
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DeckDetailPage