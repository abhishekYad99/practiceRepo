const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// Include the assignee's basic info with every task so the frontend can show a
// name without a second request.
const taskInclude = {
  assignedTo: { select: { id: true, name: true, email: true } },
};

// Tasks that "belong to" the current user = ones they own or are assigned.
function ownScope(userId) {
  return { OR: [{ ownerId: userId }, { assignedToId: userId }] };
}

// GET /api/tasks  (protected)
// Query params: status, priority, search, page, pageSize
const listTasks = asyncHandler(async (req, res) => {
  const { status, priority, search } = req.query;
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || "20", 10), 1), 100);

  const where = { AND: [ownScope(req.user.id)] };
  if (status) where.AND.push({ status });
  if (priority) where.AND.push({ priority });
  if (search) where.AND.push({ title: { contains: search, mode: "insensitive" } });

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: taskInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.task.count({ where }),
  ]);

  res.json({ items, total, page, pageSize });
});

// GET /api/tasks/:id  (protected)
const getTask = asyncHandler(async (req, res) => {
  const task = await prisma.task.findFirst({
    where: { id: req.params.id, ...ownScope(req.user.id) },
    include: taskInclude,
  });
  if (!task) throw new ApiError(404, "Task not found");
  res.json(task);
});

// POST /api/tasks  (protected)
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate, assignedToId } = req.body;
  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      status,
      dueDate,
      ownerId: req.user.id,
      assignedToId: assignedToId || null,
    },
    include: taskInclude,
  });
  res.status(201).json(task);
});

// PUT /api/tasks/:id  (protected) — owner only
const updateTask = asyncHandler(async (req, res) => {
  const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.ownerId !== req.user.id) {
    throw new ApiError(404, "Task not found");
  }
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: req.body,
    include: taskInclude,
  });
  res.json(task);
});

// DELETE /api/tasks/:id  (protected) — owner only
const deleteTask = asyncHandler(async (req, res) => {
  const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.ownerId !== req.user.id) {
    throw new ApiError(404, "Task not found");
  }
  await prisma.task.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
