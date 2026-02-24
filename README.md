# Pokemon TCG Deck Builder

A full-stack web application for browsing Pokemon TCG cards and managing custom decks.

![Pokemon TCG Deck Builder](https://img.shields.io/badge/Pokemon-TCG-ffcb05?style=for-the-badge&labelColor=1a1a2e)

---

## Features

- Browse Pokemon TCG cards from the full TCGdex catalog
- Search cards by name (client-side)
- Filter cards by rarity and type (API + client-side)
- Viewport-based pagination — each page shows as many cards as fit on screen (First / Previous / Next / Last)
- Cards without images are sorted to the end of the list
- Create, rename, and delete custom decks
- Add cards to decks from the deck detail page
- Persistent storage via SQLite database
- Responsive design (mobile + desktop)

---

## Tech Stack

### Frontend
- **React 18+** + **TypeScript** — component-based UI with full type safety
- **Vite** — fast dev server and bundler with native ES module support
- **Lit** — Web Components for the `pokemon-card` custom element
- **React Router** — client-side routing
- **CSS Modules** — scoped styles per component
- **State** — local component state + custom hooks (no Redux or other global store)

### Backend
- **Fastify** — high-performance Node.js web framework
- **better-sqlite3** — synchronous SQLite driver
- **TypeScript** — type-safe server code

---

## Architecture Decisions

### Why Vite over Create React App?
Vite uses native ES modules during development, which means near-instant startup and HMR. This was especially important for Lit Web Components, which are distributed as ES modules and work seamlessly with Vite's module resolution without additional configuration.

### Why Fastify over Express?
Fastify offers significantly better throughput than Express according to benchmarks. It also ships with built-in TypeScript support and JSON schema validation for request/response — no extra configuration needed. The plugin system (used for CORS) is clean and well-typed.

### Why Lit Web Components?
The `pokemon-card` component is implemented as a native Web Component using Lit. This demonstrates framework-agnostic component design — the same component could be used in Vue, Angular, or plain HTML without modification. Lit's reactive properties and template system provide a clean declarative API with minimal overhead.

### Why better-sqlite3?
SQLite is sufficient for a local application and requires zero infrastructure. `better-sqlite3` uses synchronous APIs which simplify Fastify route handlers — no need for async/await chains when querying the database. The tradeoff (blocking I/O) is acceptable for a single-user local app.

### Deck Creation Flow
Cards are added to a deck after creation rather than during it. This was a deliberate UX decision — forcing users to select cards upfront before naming a deck creates unnecessary friction. The current flow (create deck → open deck → browse and add cards) mirrors how physical TCG players actually build decks: they name the deck first, then fill it.

### Data Enrichment Strategy
The TCGdex API returns minimal card data in list endpoints (`id`, `name`, `image`) but full data on individual card endpoints. Rather than making 100+ individual API calls on load, the app fetches the full card list once and enriches deck cards client-side by matching `card_id` from the database against the cached card list. This keeps the backend simple and avoids unnecessary external API calls from the server.

### API Contract
The backend uses snake_case (`created_at`) following SQLite conventions. The frontend API client maps these to camelCase (`createdAt`) at the boundary layer, keeping the rest of the frontend code consistent with JavaScript/TypeScript conventions.

### Filtering Strategy
Cards are loaded from the TCGdex `/cards` endpoint (all cards, or with `?rarity=...` and `?types=...` when filters are set). Name search is applied client-side on the current result set. Cards without an image are sorted to the end so they don’t clutter the main list.

---

## Project Structure

```
pokemon-deck-builder/
├── frontend/
│   └── src/
│       ├── api/              # API clients (tcgdex + backend)
│       ├── components/       # Shared UI components (Navbar, SearchBar, Modal)
│       ├── hooks/            # Custom React hooks (useCards, useDecks, useDeck)
│       ├── pages/            # Route-level components
│       │   ├── CardsPage/
│       │   ├── DecksPage/
│       │   └── DeckDetailPage/
│       ├── types/            # TypeScript interfaces
│       └── web-components/   # Lit pokemon-card component
└── backend/
    └── src/
        ├── db/               # SQLite setup and schema
        ├── routes/           # Fastify route handlers
        └── types/            # Backend TypeScript interfaces
```

Shared components in `components/` follow this pattern (with a `ui/` subfolder for the main component and styles):
```
ComponentName/
├── ui/
│   ├── ComponentName.tsx
│   └── ComponentName.module.css
└── index.ts                  # Barrel export
```

Pages in `pages/` keep their files directly in the page folder (e.g. `DecksPage/DecksPage.tsx`, `DecksPage/DecksPage.module.css`) since each page is a single route-level component.

---

## Getting Started

Requires **Node.js 20+**.

### Installation

Clone the repository:
```bash
git clone https://github.com/Natalina27/pokemon-deck-builder.git
cd pokemon-deck-builder
cd frontend && npm install && cd ..
cd backend && npm install
```

Run the app in **two terminals**:

| Terminal 1 (backend)        | Terminal 2 (frontend)        |
|-----------------------------|------------------------------|
| `cd backend && npm run dev` | `cd frontend && npm run dev` |

Then open **[http://localhost:5173](http://localhost:5173)** in your browser. The API is at `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/decks` | List all decks |
| POST | `/decks` | Create a new deck |
| GET | `/decks/:id` | Get deck with cards |
| PATCH | `/decks/:id` | Rename a deck |
| DELETE | `/decks/:id` | Delete a deck |
| POST | `/decks/:id/cards` | Add a card to a deck |

---

## Database Schema

```sql
CREATE TABLE decks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deck_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deck_id INTEGER NOT NULL,
  card_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);
```

---

## Code Quality

- **ESLint** + **Prettier** configured for both frontend and backend
- Run `npm run lint` in `frontend/` and `backend/` to check for issues
- Run `npm run format` in `frontend/` and `backend/` to auto-format code

---

## Known Limitations & Future Improvements

**Game rules & UX**
- **No deck size limit** — in a real Pokemon TCG app, decks are limited to 60 cards with max 4 copies of any non-basic-energy card
- **No remove card from deck** — cards can be added but not removed; UI could show quantity per card and allow increment/decrement/remove
- **DeckDetailPage** — "Add cards" loads all cards at once; pagination or virtual list would scale better on large catalogs

**Architecture & config**
- **API base URL** — backend URL is hardcoded (`http://localhost:3000`) in `frontend/src/api/decks.ts`; use `VITE_API_URL` (or similar) so dev/staging/production can point to different backends
- **SQLite in production** — for a multi-user production app, PostgreSQL would be a better choice for concurrency and scalability
- **Card data not cached** — every DeckDetailPage visit fetches all cards from TCGdex; React Query (or similar) would reduce redundant requests and improve performance

**UI & consistency**
- **Error and loading states** — CardsPage uses a skeleton; DeckDetailPage uses plain "Loading..." and minimal error text; a shared `ErrorBoundary` and loading component would unify UX
- **Accessibility** — improve a11y (e.g. skip links, focus management in modals, clearer form labels and live regions for dynamic content)

**Testing**
- **Backend tests** — no unit or integration tests for Fastify routes and DB; adding them would protect API contracts and schema changes
- **E2E tests** — critical flows (create deck, add card, rename, delete) could be covered with Playwright or Cypress


---

## Testing

The frontend includes unit tests written with **Vitest** and **React Testing Library**.

Run tests (from `/frontend`):
```bash
npm run test
```

Current coverage:
- `useDecks` hook — load, create, rename, delete, duplicate name validation
- Decks API client — response mapping, error handling, request payload

---

## Development Notes

AI tools were used during development, primarily for boilerplate generation, debugging, and documentation. All architectural decisions, technology choices, and implementation approaches were made independently.