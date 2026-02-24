import type { CardBrief, Card } from '../types'

const BASE_URL = 'https://api.tcgdex.net/v2/en'

export async function getCards(filters?: {
  rarity?: string
  types?: string
}): Promise<CardBrief[]> {
  const params = new URLSearchParams()
  if (filters?.rarity) params.append('rarity', filters.rarity)
  if (filters?.types) params.append('types', filters.types)
  const query = params.toString()
  const url = query ? `${BASE_URL}/cards?${query}` : `${BASE_URL}/cards`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch cards')
  const cards: CardBrief[] = await response.json()
  return cards.sort((a, b) => {
    const aHasImage = Boolean(a.image?.trim())
    const bHasImage = Boolean(b.image?.trim())
    if (aHasImage === bHasImage) return 0
    return aHasImage ? -1 : 1
  })
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
