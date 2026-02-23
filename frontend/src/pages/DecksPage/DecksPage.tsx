import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDecks } from '../../hooks'
import { Modal } from '../../components'
import styles from './DecksPage.module.css'

const DecksPage = () => {
  const { decks, loading, error, handleDelete, handleCreate, handleRename } = useDecks()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deckName, setDeckName] = useState('')
  const [modalError, setModalError] = useState<string | null>(null)
  const [editingDeck, setEditingDeck] = useState<{ id: number; name: string } | null>(null)

  const onCreateDeck = async () => {
    if (!deckName.trim()) return
    setModalError(null)
    try {
      await handleCreate(deckName)
      setDeckName('')
      setIsModalOpen(false)
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to create deck')
    }
  }

  const onRenameDeck = async () => {
    if (!editingDeck || !editingDeck.name.trim()) return
    setModalError(null)
    try {
      await handleRename(editingDeck.id, editingDeck.name)
      setEditingDeck(null)
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to rename deck')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <p>{error.message}</p>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Decks</h1>
        <button className={styles.button} onClick={() => setIsModalOpen(true)}>
          Create Deck
        </button>
      </div>

      {decks.length === 0 && <p>No decks yet</p>}

      {decks.map(deck => (
        <div key={deck.id} className={styles.deck}>
          <Link to={`/decks/${deck.id}`} className={styles.deckLink}>
            {deck.name}
          </Link>
          <div className={styles.actions}>
            <button
              className={styles.editButton}
              onClick={() => { setEditingDeck({ id: deck.id, name: deck.name }); setModalError(null) }}
            >
              Rename
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(deck.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Create New Deck</h2>
        {modalError && <p className={styles.error}>{modalError}</p>}
        <input
          type="text"
          placeholder="Deck name..."
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />
        <button onClick={onCreateDeck}>Create</button>
      </Modal>

      <Modal isOpen={!!editingDeck} onClose={() => setEditingDeck(null)}>
        <h2>Rename Deck</h2>
        {modalError && <p className={styles.error}>{modalError}</p>}
        <input
          type="text"
          placeholder="New deck name..."
          value={editingDeck?.name ?? ''}
          onChange={(e) => setEditingDeck(prev => prev ? { ...prev, name: e.target.value } : null)}
        />
        <button onClick={onRenameDeck}>Save</button>
      </Modal>
    </div>
  )
}

export default DecksPage