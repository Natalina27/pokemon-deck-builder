import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDecks } from '../hooks'
import * as api from '../api'

vi.mock('../api')

const mockDecks = [
  { id: 1, name: 'My First Deck', createdAt: '2024-01-01' },
  { id: 2, name: 'Fire Deck', createdAt: '2024-01-02' },
]

beforeEach(() => {
  vi.mocked(api.getDecks).mockResolvedValue(mockDecks)
  vi.mocked(api.createDeck).mockResolvedValue({
    id: 3,
    name: 'New Deck',
    createdAt: '2024-01-03',
  })
  vi.mocked(api.deleteDeck).mockResolvedValue(undefined)
  vi.mocked(api.renameDeck).mockResolvedValue(undefined)
})

describe('useDecks', () => {
  it('loads decks on mount', async () => {
    const { result } = renderHook(() => useDecks())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.decks).toHaveLength(2)
    expect(result.current.decks[0].name).toBe('My First Deck')
  })

  it('creates a new deck', async () => {
    const { result } = renderHook(() => useDecks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.handleCreate('New Deck')
    })

    expect(result.current.decks).toHaveLength(3)
    expect(result.current.decks[2].name).toBe('New Deck')
  })

  it('throws error when creating deck with duplicate name', async () => {
    const { result } = renderHook(() => useDecks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await expect(
      act(async () => {
        await result.current.handleCreate('My First Deck')
      })
    ).rejects.toThrow('A deck with this name already exists')
  })

  it('deletes a deck', async () => {
    const { result } = renderHook(() => useDecks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.handleDelete(1)
    })

    expect(result.current.decks).toHaveLength(1)
    expect(result.current.decks[0].id).toBe(2)
  })

  it('renames a deck', async () => {
    const { result } = renderHook(() => useDecks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.handleRename(1, 'Renamed Deck')
    })

    expect(result.current.decks[0].name).toBe('Renamed Deck')
  })
})
