import { useState, useEffect } from 'react'
import { getDecks, deleteDeck } from '../api'
import type { Deck } from '../types'

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchDecks() {
      try {
        const data = await getDecks()
        setDecks(data)
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error('Failed to load decks')
        )
      } finally {
        setLoading(false)
      }
    }
    fetchDecks()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteDeck(id)
      setDecks((prev) => prev.filter((deck) => deck.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete deck'))
    }
  }

  return { decks, loading, error, handleDelete }
}
