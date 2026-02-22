import '../web-components/pokemon-card'
import '../types/custom-elements-jsx'
import { useCards } from '../hooks/useCards'

const CardsPage = () => {
  const { cards, loading, error } = useCards()

  if (loading) return <div>Loading...</div>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      {cards.map((card) => (
        <pokemon-card 
          key={card.id} 
          name={card.name} 
          image={`${card.image}/high.webp`} 
        />
      ))}
    </div>
  );
};

export default CardsPage;