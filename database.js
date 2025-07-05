const db = new sqlite3.Database("./database.db");

function initializeDatabase() {
  db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userEmail TEXT,
            reservationDate TEXT,
            reservationTime TEXT,
            userPhoneNumber TEXT,
            approved TEXT DEFAULT "false",
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS foods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            photo TEXT,
            quantity INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
  });
}

module.exports = { initializeDatabase };
