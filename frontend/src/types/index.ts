export interface CardBrief {
  id: string
  name: string
  image: string
  localId: string
  quantity?: number
  rarity?: string
  types?: string[]
}

export interface Card {
  id: string
  name: string
  image: string
  localId: string
  rarity?: string
  types?: string[]
  hp?: number
}

export interface Deck {
  id: number
  name: string
  createdAt: string
  cards?: CardBrief[]
}
