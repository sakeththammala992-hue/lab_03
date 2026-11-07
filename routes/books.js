const express = require("express");
const { getDb } = require("../db");
const HttpError = require("../utils/HttpError");
const { buildListQuery } = require("../utils/listQuery");
const { checkBookId, checkBookBody } = require("../middleware/validators");

const router = express.Router();

// GET /books/  ->  search, sort, paginate, price range
router.get("/", async (req, res) => {
  const { sql, params } = buildListQuery(req.query);
  const books = await getDb().all(sql, params);
  res.status(200).json(books);
});

// GET /books/:bookId/  ->  one book
router.get("/:bookId", checkBookId, async (req, res) => {
  const book = await getDb().get("SELECT * FROM book WHERE id = ?;", [req.bookId]);
  if (!book) {
    throw new HttpError(404, `No book with id ${req.bookId}`);
  }
  res.status(200).json(book);
});

// POST /books/  ->  create
router.post("/", checkBookBody, async (req, res) => {
  const { title, author, price, pages } = req.bookData;
  const db = getDb();
  const result = await db.run(
    "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?);",
    [title, author, price, pages]
  );
  const created = await db.get("SELECT * FROM book WHERE id = ?;", [result.lastID]);
  res.status(201).json({ message: "Book created", book: created });
});

// PUT /books/:bookId/  ->  replace all fields
router.put("/:bookId", checkBookId, checkBookBody, async (req, res) => {
  const { title, author, price, pages } = req.bookData;
  const db = getDb();
  const result = await db.run(
    "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?;",
    [title, author, price, pages, req.bookId]
  );
  if (result.changes === 0) {
    throw new HttpError(404, `No book with id ${req.bookId}`);
  }
  const updated = await db.get("SELECT * FROM book WHERE id = ?;", [req.bookId]);
  res.status(200).json({ message: "Book updated", book: updated });
});

// DELETE /books/:bookId/  ->  remove
router.delete("/:bookId", checkBookId, async (req, res) => {
  const result = await getDb().run("DELETE FROM book WHERE id = ?;", [req.bookId]);
  if (result.changes === 0) {
    throw new HttpError(404, `No book with id ${req.bookId}`);
  }
  res.status(200).json({ message: "Book deleted" });
});

module.exports = router;
