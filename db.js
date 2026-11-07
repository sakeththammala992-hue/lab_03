const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const DB_PATH = path.join(__dirname, "books.db");

let connection = null;

// Opens books.db once at start-up.
async function connectDb() {
  connection = await open({ filename: DB_PATH, driver: sqlite3.Database });
  return connection;
}

// Routes call this to get the open connection.
function getDb() {
  if (!connection) {
    throw new Error("Database is not connected yet");
  }
  return connection;
}

module.exports = { connectDb, getDb };
