import { BrowserRouter, Routes, Route } from "react-router-dom"
import CardsPage from "./pages/CardsPage"
import DecksPage from "./pages/DecksPage"
import DeckDetailPage from "./pages/DeckDetailPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CardsPage />} />
        <Route path="/decks" element={<DecksPage />} />
        <Route path="/decks/:id" element={<DeckDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
