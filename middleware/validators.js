const HttpError = require("../utils/HttpError");

// :bookId in the URL must be a positive whole number.
function checkBookId(req, res, next) {
  const raw = req.params.bookId;
  if (!/^\d+$/.test(raw) || Number(raw) < 1) {
    throw new HttpError(400, "bookId must be a positive whole number");
  }
  req.bookId = Number(raw);
  next();
}

const isText = (value) => typeof value === "string" && value.trim().length > 0;
const isCount = (value) => typeof value === "number" && Number.isInteger(value) && value >= 0;

// Checks the JSON body of POST and PUT. On success the cleaned values are
// stored in req.bookData for the route to use.
function checkBookBody(req, res, next) {
  const body = req.body;
  if (body === undefined || body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object");
  }

  if (!isText(body.title)) {
    throw new HttpError(400, "title is missing or empty");
  }
  if (!isText(body.author)) {
    throw new HttpError(400, "author is missing or empty");
  }
  if (!isCount(body.price)) {
    throw new HttpError(400, "price must be a number (whole, 0 or more)");
  }
  if (!isCount(body.pages)) {
    throw new HttpError(400, "pages must be a number (whole, 0 or more)");
  }

  req.bookData = {
    title: body.title.trim(),
    author: body.author.trim(),
    price: body.price,
    pages: body.pages,
  };
  next();
}

module.exports = { checkBookId, checkBookBody };
