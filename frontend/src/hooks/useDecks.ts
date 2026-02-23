import { useState, useEffect } from 'react'
import { getDecks, createDeck, deleteDeck, renameDeck } from '../api'
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

  const handleCreate = async (name: string) => {
    if (decks.some((deck) => deck.name.toLowerCase() === name.toLowerCase())) {
      throw new Error('A deck with this name already exists')
    }
    const newDeck = await createDeck(name, [])
    setDecks((prev) => [...prev, newDeck])
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteDeck(id)
      setDecks((prev) => prev.filter((deck) => deck.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete deck'))
    }
  }

  const handleRename = async (id: number, name: string) => {
    if (decks.some((deck) => deck.name.toLowerCase() === name.toLowerCase() && deck.id !== id)) {
      throw new Error('A deck with this name already exists')
    }
    await renameDeck(id, name)
    setDecks((prev) => prev.map((deck) => deck.id === id ? { ...deck, name } : deck))
  }

  return { decks, loading, error, handleCreate, handleDelete, handleRename }
}