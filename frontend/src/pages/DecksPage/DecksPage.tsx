import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDecks } from '../../hooks'
import { Modal } from '../../components'
import styles from './DecksPage.module.css'

const DecksPage = () => {
  const { decks, loading, error, handleDelete, handleCreate } = useDecks()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deckName, setDeckName] = useState('')
  const [modalError, setModalError] = useState<string | null>(null)

  const onCreateDeck = async () => {
    if (!deckName.trim()) return
    setModalError(null)
    try {
      await handleCreate(deckName)
      setDeckName('')
      setIsModalOpen(false)
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : 'Failed to create deck'
      )
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
          <button onClick={() => handleDelete(deck.id)}>Delete</button>
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
    </div>
  )
}

export default DecksPage
