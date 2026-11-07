const app = require("./app");
const { connectDb } = require("./db");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDb();
  } catch (err) {
    console.error(`Cannot open books.db: ${err.message}`);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`Books API listening on port ${PORT}`);
  });

  // For example EADDRINUSE: another program is already using this port
  server.on("error", (err) => {
    console.error(`Cannot start server: ${err.message}`);
    process.exit(1);
  });
}

start();
