import type { CardBrief, Card } from '../types'

const BASE_URL = 'https://api.tcgdex.net/v2/en'

export async function getCards(filters?: { rarity?: string; types?: string }): Promise<CardBrief[]> {
  if (filters?.rarity || filters?.types) {
    const params = new URLSearchParams()
    if (filters.rarity) params.append('rarity', filters.rarity)
    if (filters.types) params.append('types', filters.types)
    const response = await fetch(`${BASE_URL}/cards?${params}`)
    if (!response.ok) throw new Error('Failed to fetch cards')
    return response.json()
  }

  const response = await fetch(`${BASE_URL}/sets/base1`)
  if (!response.ok) throw new Error('Failed to fetch cards')
  const data = await response.json()
  return data.cards
}

export async function getCard(id: string): Promise<Card> {
  const response = await fetch(`${BASE_URL}/cards/${id}`)
  if (!response.ok) throw new Error('Failed to fetch card')
  return response.json()
}

export async function getRarities(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/rarities`)
  if (!response.ok) throw new Error('Failed to fetch rarities')
  return response.json()
}

export async function getTypes(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/types`)
  if (!response.ok) throw new Error('Failed to fetch types')
  return response.json()
}