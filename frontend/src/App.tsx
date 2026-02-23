import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components'
import { CardsPage, DecksPage, DeckDetailPage } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CardsPage />} />
        <Route path="/decks" element={<DecksPage />} />
        <Route path="/decks/:id" element={<DeckDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
