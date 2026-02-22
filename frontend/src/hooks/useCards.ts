import { useState, useEffect } from 'react'
import { getCards } from '../api/tcgdex'
import type { CardBrief } from '../types'

export function useCards() {
    const [cards, setCards] = useState<CardBrief[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchCards() {
            try {
                const data = await getCards()
                setCards(data)
            } catch (error) {
                setError(error instanceof Error ? error : new Error('Failed to load cards'))
            } finally {
                setLoading(false)
            }
        }
        fetchCards()
    }, [])
    return { cards, loading, error }
}
