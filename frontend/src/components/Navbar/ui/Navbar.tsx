import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <span className={styles.logo}>Pokemon TCG</span>
        <div className={styles.links}>
          <Link to="/" className={styles.link}>
            Cards
          </Link>
          <Link to="/decks" className={styles.link}>
            My Decks
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
