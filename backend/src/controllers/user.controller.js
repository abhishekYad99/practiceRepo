const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { toPublicUser } = require("../utils/serialize");

// GET /api/users  (protected)
// Used for the "assign task to user" dropdown and name lookups.
const listUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  res.json(users);
});

// PATCH /api/users/me  (protected)
// Lets the logged-in user edit their own name (used by the header user menu).
const updateMe = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name },
  });
  res.json({ user: toPublicUser(user) });
});

module.exports = { listUsers, updateMe };
