const env = require("../config/env");

// 404 handler for unmatched routes.
function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler. Reads statusCode set by ApiError (defaults to 500).
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Prisma "record not found" on update/delete.
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Resource not found" });
  }
  // Prisma unique constraint violation (e.g. duplicate email).
  if (err.code === "P2002") {
    return res.status(409).json({ message: "A record with this value already exists" });
  }

  const status = err.statusCode || 500;
  const body = { message: err.message || "Internal server error" };
  if (env.NODE_ENV !== "production") {
    body.stack = err.stack;
  }
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json(body);
}

module.exports = { notFound, errorHandler };
