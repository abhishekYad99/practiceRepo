const { verifyToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");

// Protects routes: requires a valid "Authorization: Bearer <token>" header.
// On success, attaches { id, email } to req.user.
module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Missing or invalid Authorization header"));
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
