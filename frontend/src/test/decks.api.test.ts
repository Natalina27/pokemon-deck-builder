import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getDecks, createDeck, deleteDeck } from '../api'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})

describe('decks API', () => {
  it('getDecks returns mapped decks', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, name: 'Test Deck', created_at: '2024-01-01' },
      ],
    })

    const decks = await getDecks()

    expect(decks).toHaveLength(1)
    expect(decks[0].createdAt).toBe('2024-01-01')
    expect(decks[0]).not.toHaveProperty('created_at')
  })

  it('getDecks throws on error response', async () => {
    mockFetch.mockResolvedValue({ ok: false })

    await expect(getDecks()).rejects.toThrow('Failed to fetch decks')
  })

  it('createDeck sends correct payload', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, name: 'New Deck', created_at: '2024-01-01' }),
    })

    await createDeck('New Deck', [])

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/decks'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'New Deck', cards: [] }),
      })
    )
  })

  it('deleteDeck calls correct endpoint', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) })

    await deleteDeck(1)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/decks/1'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })
})
