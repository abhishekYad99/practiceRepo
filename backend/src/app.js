const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()),
    credentials: true,
  })
);
app.use(express.json());
if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Root check — handy for confirming the server is reachable from another machine.
app.get("/", (req, res) =>
  res.json({ message: "hello from abhishek", status: "ok", time: new Date().toISOString() })
);

// Health check.
app.get("/health", (req, res) => res.json({ status: "ok" }));

// All API routes live under /api.
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
