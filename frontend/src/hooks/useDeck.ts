import { useState, useEffect } from 'react'
import { getDeck, getCards } from '../api'
import type { Deck, DeckCard } from '../types'

export const useDeck = (id: number) => {
  const [deck, setDeck] = useState<Deck | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchDeck() {
      try {
        const [deckData, allCards] = await Promise.all([
          getDeck(id),
          getCards(),
        ])

        const enrichedCards = deckData.cards
          ?.map((deckCard: DeckCard) => {
            const card = allCards.find((c) => c.id === deckCard.card_id)
            return card ? { ...card, quantity: deckCard.quantity } : null
          })
          .filter((card): card is NonNullable<typeof card> => card !== null)

        setDeck({ ...deckData, cards: enrichedCards })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load deck'))
      } finally {
        setLoading(false)
      }
    }
    fetchDeck()
  }, [id])

  return { deck, loading, error, setDeck }
}
