import Database from 'better-sqlite3'

const db = new Database('./pokemon-decks.db')

db.exec(`
    CREATE TABLE IF NOT EXISTS decks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS deck_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deck_id INTEGER NOT NULL,
        card_id TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );
`)

export default db