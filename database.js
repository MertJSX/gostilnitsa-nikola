const sqlite3 = require("sqlite3")
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
            image TEXT,
            quantity INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
  });
}

function getAllFoods(callback) {
  db.all('SELECT * FROM foods', (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
}

function createFood(food, callback) {
  const { name, description, price, image } = food;
  db.run(
    `INSERT INTO foods (name, description, price, image) VALUES (?, ?, ?, ?)`,
    [name, description, price, image],
    function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...food });
    }
  );
}

function updateFoodQuantity(id, quantity, callback) {
  db.run(
    `UPDATE foods SET quantity = ? WHERE id = ?`,
    [quantity, id],
    function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id, quantity, changes: this.changes });
    }
  );
}

function createReservation(reservation, callback) {
  const { userEmail, reservationDate, reservationTime, userPhoneNumber, approved } = reservation;
  db.run(
    `INSERT INTO reservations (userEmail, reservationDate, reservationTime, userPhoneNumber, approved) VALUES (?, ?, ?, ?, ?)`,
    [userEmail, reservationDate, reservationTime, userPhoneNumber, approved || "false"],
    function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...reservation });
    }
  );
}

function getAllReservations(callback) {
  db.all('SELECT * FROM reservations', (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
}


module.exports = { initializeDatabase, getAllFoods, createFood, updateFoodQuantity };
