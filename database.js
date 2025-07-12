const sqlite3 = require("sqlite3");
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
            approved TEXT DEFAULT "waiting",
            finished TEXT DEFAULT "false",
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
  db.all("SELECT * FROM foods", (err, rows) => {
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

function deleteFood(id, callback) {
  db.run(`DELETE FROM foods WHERE id = ?`, [id], function (err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id, changes: this.changes });
  });
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
  const { email, reservationDate, reservationTime, phoneNumber, approved } =
    reservation;
  db.run(
    `INSERT INTO reservations (userEmail, reservationDate, reservationTime, userPhoneNumber, approved) VALUES (?, ?, ?, ?, ?)`,
    [email, reservationDate, reservationTime, phoneNumber, approved || "waiting"],
    function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...reservation });
    }
  );
}

function getAllReservations(callback, approved) {
  let query = "SELECT * FROM reservations WHERE finished = 'false'";
  let params = [];
  if (approved !== undefined) {
    query += " AND approved = ?";
    params.push(approved);
  }
  query +=
    " ORDER BY reservationDate DESC, reservationTime DESC, created_at DESC";
  db.all(query, params, (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
}

function getAvailableFoods(callback) {
  db.all("SELECT * FROM foods WHERE quantity >= 1", (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
}

function updateReservationApproval(id, approved, callback) {
  db.run(
    `UPDATE reservations SET approved = ? WHERE id = ?`,
    [approved, id],
    function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id, approved, changes: this.changes });
    }
  );
}

function finishReservation(id, callback) {
  db.run(
    `UPDATE reservations SET finished = 'true' WHERE id = ?`,
    [id],
    function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id, finished: true, changes: this.changes });
    }
  );
}

function getStatistics(callback) {
  const stats = {};
  db.serialize(() => {
    db.get("SELECT COUNT(*) AS totalFoods FROM foods", (err, row) => {
      if (err) return callback(err);
      stats.totalFoods = row.totalFoods;

      db.get(
        "SELECT COUNT(*) AS waitingReservations FROM reservations WHERE approved = 'waiting' AND finished = 'false'",
        (err, row) => {
          if (err) return callback(err);
          stats.waitingReservations = row.waitingReservations;

          db.get(
            "SELECT COUNT(*) AS totalReservations FROM reservations WHERE finished = 'false'",
            (err, row) => {
              if (err) return callback(err);
              stats.totalReservations = row.totalReservations;

              db.get(
                "SELECT COUNT(*) AS approvedReservations FROM reservations WHERE approved = 'approved' AND finished = 'false'",
                (err, row) => {
                  if (err) return callback(err);
                  stats.approvedReservations = row.approvedReservations;

                  db.get(
                    "SELECT COUNT(*) AS availableFoods FROM foods WHERE quantity > 0",
                    (err, row) => {
                      if (err) return callback(err);
                      stats.availableFoods = row.availableFoods;

                      callback(null, stats);
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
}

module.exports = {
  initializeDatabase,
  getAllFoods,
  createFood,
  updateFoodQuantity,
  getAllReservations,
  createReservation,
  getAvailableFoods,
  deleteFood,
  updateReservationApproval,
  finishReservation,
  getStatistics,
};
