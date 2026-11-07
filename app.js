const express = require("express");
const HttpError = require("./utils/HttpError");
const booksRouter = require("./routes/books");

const app = express();

// Reads JSON request bodies into req.body
app.use(express.json());

app.use("/books", booksRouter);

// Nothing above matched this URL
app.use((req, res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// One place that turns every error into the same JSON shape: { message }
// (Express 5 sends errors from async routes here automatically.)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON" });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server" });
});

module.exports = app;
