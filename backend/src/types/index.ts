export interface Deck {
    id: number
    name: string
    created_at: string
  }
  
  export interface DeckCard {
    id: number
    deck_id: number
    card_id: string
    quantity: number
  }
  
  export interface CreateDeckBody {
    name: string
    cards: { card_id: string; quantity: number }[]
  }