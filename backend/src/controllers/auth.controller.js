const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { signToken } = require("../utils/jwt");
const { toPublicUser } = require("../utils/serialize");

// POST /api/auth/signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: passwordHash },
  });

  const token = signToken({ sub: user.id, email: user.email });
  res.status(201).json({ token, user: toPublicUser(user) });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const ok = await bcrypt.compare(user.password, password);
  if (!ok) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ sub: user.id, email: user.email });
  res.json({ token, user: toPublicUser(user) });
});

// GET /api/auth/me  (protected)
const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json({ user: toPublicUser(user) });
});

module.exports = { signup, login, me };
