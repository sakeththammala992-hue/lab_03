// An Error that also remembers which HTTP status code should be sent.
// Routes and middleware throw it; the error handler in app.js reads it.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

module.exports = HttpError;
