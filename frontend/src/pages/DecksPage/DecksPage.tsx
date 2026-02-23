import { useDecks } from '../../hooks'

const DecksPage = () => {
  const { decks, loading, error, handleDelete } = useDecks()

  if (loading) return <div>Loading...</div>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <h1>My Decks</h1>
      {decks.length === 0 && <p>No decks found</p>}
      {decks.map((deck) => (
        <div key={deck.id}>
          <span>{deck.name}</span>
          <button onClick={() => handleDelete(deck.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default DecksPage
