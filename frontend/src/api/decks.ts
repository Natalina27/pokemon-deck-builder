import type { Deck, RawDeck } from '../types'

const BASE_URL = 'http://localhost:3000'

export const getDecks = async (): Promise<Deck[]> => {
  const response = await fetch(`${BASE_URL}/decks`)

  if (!response.ok) throw new Error('Failed to fetch decks')

  const data = await response.json()

  return data.map((deck: { id: number; name: string; created_at: string }) => ({
    id: deck.id,
    name: deck.name,
    createdAt: deck.created_at,
  }))
}

export const getDeck = async (id: number): Promise<RawDeck> => {
  const response = await fetch(`${BASE_URL}/decks/${id}`)
  if (!response.ok) throw new Error('Failed to fetch deck')
  const data = await response.json()
  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    cards: data.cards,
  }
}

export const createDeck = async (
  name: string,
  cards: { card_id: string; quantity: number }[]
): Promise<Deck> => {
  const response = await fetch(`${BASE_URL}/decks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, cards }),
  })

  if (!response.ok) throw new Error('Failed to create deck')

  const data = await response.json()

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at ?? new Date().toISOString(),
    cards: [],
  }
}

export const deleteDeck = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/decks/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete deck')
}

export const addCardToDeck = async (
  deckId: number,
  cardId: string
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/decks/${deckId}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ card_id: cardId, quantity: 1 }),
  })
  if (!response.ok) throw new Error('Failed to add card to deck')
}

export const renameDeck = async (id: number, name: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/decks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!response.ok) throw new Error('Failed to rename deck')
}
