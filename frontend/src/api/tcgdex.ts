import type { CardBrief, Card } from '../types'

const BASE_URL = 'https://api.tcgdex.net/v2/en'

export async function getCards(): Promise<CardBrief[]> {
  const response = await fetch(`${BASE_URL}/sets/base1`)
  const data = await response.json()
  return data.cards
}

export async function getCard(id: string): Promise<Card> {
  const response = await fetch(`${BASE_URL}/cards/${id}`)
  const data = await response.json()
  return data
}
