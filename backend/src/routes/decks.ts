import { FastifyInstance } from 'fastify'
import db from '../db/database'
import type { CreateDeckBody } from '../types'

export const deckRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/decks', async () => {
        const decks = db.prepare('SELECT * FROM decks').all()
        return decks
    })

    fastify.post<{ Body: CreateDeckBody }>('/decks', async (request) => {
        const { name, cards } = request.body 
        
        const insertDeck = db.prepare('INSERT INTO decks (name) VALUES (?)')
        const deck = insertDeck.run(name)

        const inserCard = db.prepare(
            'INSERT INTO deck_cards (deck_id, card_id, quantity) VALUES (?, ?, ?)'
        )
        for (const card of cards) {
            inserCard.run(deck.lastInsertRowid, card.card_id, card.quantity)
        }

        return { id: deck.lastInsertRowid, name }
    })

    fastify.get<{ Params: { id: string } }>('/decks/:id', async (request) => {
        const { id } = request.params
        
        const deck = db.prepare('SELECT * FROM decks WHERE id = ?').get(id) as Record<string, unknown> 
        const cards = db.prepare('SELECT * FROM deck_cards WHERE deck_id = ?').all(id) as Record<string, unknown>[]

        return { ...deck, cards }

    })

    fastify.delete<{ Params: { id: string } }>('/decks/:id', async (request) => {
        const { id } = request.params

        db.prepare('DELETE FROM decks WHERE id = ?').run(id)

        return {success: true}
    })
}