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
                setError(error instanceof Error ? error : new Error('Failed to load decks'))
            } finally {
                setLoading(false)
            }
        }
        fetchDecks()
    }, [])

    const handleDelete = async (id: number) => {
        await deleteDeck(id)
        setDecks(decks.filter(deck => deck.id !== id))  
    }
    return { decks, loading, error, handleDelete }
}

