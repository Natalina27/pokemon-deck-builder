import { useState, useEffect } from 'react'
import { getCards, getRarities, getTypes } from '../api'
import type { CardBrief } from '../types'

export function useCards() {
  const [cards, setCards] = useState<CardBrief[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [rarities, setRarities] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [selectedRarity, setSelectedRarity] = useState('')
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    async function fetchFilters() {
      const [raritiesData, typesData] = await Promise.all([getRarities(), getTypes()])
      setRarities(raritiesData)
      setTypes(typesData)
    }
    fetchFilters()
  }, [])

  useEffect(() => {
    async function fetchCards() {
      try {
        setLoading(true)
        const filters = {
          rarity: selectedRarity || undefined,
          types: selectedType || undefined,
        }
        const data = await getCards(filters)
        setCards(data)
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Failed to load cards'))
      } finally {
        setLoading(false)
      }
    }
    fetchCards()
  }, [selectedRarity, selectedType])

  return { cards, loading, error, rarities, types, selectedRarity, selectedType, setSelectedRarity, setSelectedType }
}