import { useCards } from '../../hooks'
import '../../web-components/pokemon-card'
import '../../types/custom-elements-jsx'
import styles from './CardsPage.module.css'

const CardsPage = () => {
  const { cards, loading, error } = useCards()

  if (loading) return <div>Loading...</div>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {cards.map((card) => (
          <pokemon-card 
            key={card.id} 
            name={card.name} 
            image={`${card.image}/high.webp`} 
            style={{display: 'block'}}
            className={styles.card}
          />
        ))}
      </div>
    </div>
  );
};

export default CardsPage;