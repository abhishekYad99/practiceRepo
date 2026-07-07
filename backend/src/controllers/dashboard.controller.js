const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

function ownScope(userId) {
  return { OR: [{ ownerId: userId }, { assignedToId: userId }] };
}

// GET /api/dashboard  (protected)
// Returns the counts the dashboard cards need. No charts — just numbers.
const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const scope = ownScope(userId);

  // Start/end of "today" in server time, for the "pending today" card.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [total, pending, inProgress, completed, pendingToday, totalDocuments] =
    await Promise.all([
      prisma.task.count({ where: scope }),
      prisma.task.count({ where: { AND: [scope, { status: "Pending" }] } }),
      prisma.task.count({ where: { AND: [scope, { status: "In Progress" }] } }),
      prisma.task.count({ where: { AND: [scope, { status: "Completed" }] } }),
      prisma.task.count({
        where: {
          AND: [
            scope,
            { status: { not: "Completed" } },
            { dueDate: { gte: startOfToday, lt: endOfToday } },
          ],
        },
      }),
      prisma.document.count({ where: { uploadedById: userId } }),
    ]);

  res.json({
    totalTasks: total,
    pending,
    inProgress,
    completed,
    pendingToday,
    totalDocuments,
  });
});

module.exports = { getSummary };
