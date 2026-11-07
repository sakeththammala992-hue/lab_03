const HttpError = require("./HttpError");

const SORT_COLUMNS = ["id", "title", "author", "price", "pages"];
const MAX_LIMIT = 100;
const BIG_NUMBER = 1000000000;

// Read one query-string value. Returns `fallback` when it is missing or
// blank, and rejects repeated values such as ?limit=1&limit=2.
function single(query, name, fallback) {
  const value = query[name];
  if (value === undefined || value === "") return fallback;
  if (Array.isArray(value)) {
    throw new HttpError(400, `${name} must be given only once`);
  }
  return value;
}

// Read a query-string value that must be a whole number between lo and hi.
function wholeNumber(query, name, fallback, lo, hi) {
  const value = single(query, name, null);
  if (value === null) return fallback;
  if (!/^\d+$/.test(value) || Number(value) < lo || Number(value) > hi) {
    throw new HttpError(400, `${name} must be a whole number between ${lo} and ${hi}`);
  }
  return Number(value);
}

// "%" and "_" are wildcards inside LIKE, so escape them to search for the
// characters themselves.
function escapeLike(text) {
  return text.replace(/[\\%_]/g, "\\$&");
}

// Turns req.query into { sql, params } for GET /books/.
// Every user value goes into params (bound to "?").
// Only column name and direction are placed in the SQL text, and only
// after being matched against the fixed lists above.
function buildListQuery(query) {
  const searchText = String(single(query, "search_q", ""));
  const column = String(single(query, "order_by", "id")).toLowerCase();
  const direction = String(single(query, "order", "ASC")).toUpperCase();
  const limit = wholeNumber(query, "limit", 10, 1, MAX_LIMIT);
  const offset = wholeNumber(query, "offset", 0, 0, BIG_NUMBER);
  const minPrice = wholeNumber(query, "min_price", 0, 0, BIG_NUMBER);
  const maxPrice = wholeNumber(query, "max_price", BIG_NUMBER, 0, BIG_NUMBER);

  if (!SORT_COLUMNS.includes(column)) {
    throw new HttpError(400, `order_by must be one of ${SORT_COLUMNS.join(", ")}`);
  }
  if (direction !== "ASC" && direction !== "DESC") {
    throw new HttpError(400, "order must be ASC or DESC");
  }
  if (minPrice > maxPrice) {
    throw new HttpError(400, "min_price must not be greater than max_price");
  }

  const sql =
    "SELECT id, title, author, price, pages FROM book " +
    "WHERE title LIKE ? ESCAPE '\\' AND price >= ? AND price <= ? " +
    `ORDER BY ${column} ${direction}, id ASC ` +
    "LIMIT ? OFFSET ?;";
  const params = [`%${escapeLike(searchText)}%`, minPrice, maxPrice, limit, offset];

  return { sql, params };
}

module.exports = { buildListQuery, escapeLike, SORT_COLUMNS };
