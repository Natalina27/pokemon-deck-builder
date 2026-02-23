import type { Deck } from '../types'

const BASE_URL = 'http://localhost:3000'

export const getDecks = async (): Promise<Deck[]> => {
    const response = await fetch(`${BASE_URL}/decks`)
    return  response.json()
}

export const getDeck = async (id: number): Promise<Deck> => {
    const response = await fetch(`${BASE_URL}/decks/${id}`)
        return  response.json()
}

export const createDeck = async (name: string, cards: { card_id: string; quantity: number }[]): Promise<Deck> => {
    const response = await fetch(`${BASE_URL}/decks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, cards })
    })
    return response.json()
}

export const deleteDeck = async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/decks/${id}`, {
      method: 'DELETE'
    })
}
