const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const documentInclude = {
  uploadedBy: { select: { id: true, name: true, email: true } },
};

// GET /api/documents  (protected)
// Query params: search, category, fileType
const listDocuments = asyncHandler(async (req, res) => {
  const { search, category, fileType } = req.query;

  const where = { AND: [{ uploadedById: req.user.id }] };
  if (category) where.AND.push({ category });
  if (fileType) where.AND.push({ fileType });
  if (search) where.AND.push({ name: { contains: search, mode: "insensitive" } });

  const documents = await prisma.document.findMany({
    where,
    include: documentInclude,
    orderBy: { createdAt: "desc" },
  });
  res.json({ items: documents });
});

// POST /api/documents  (protected)
const createDocument = asyncHandler(async (req, res) => {
  const { name, category, fileType } = req.body;
  const doc = await prisma.document.create({
    data: { name, category, fileType, uploadedById: req.user.id },
    include: documentInclude,
  });
  res.status(201).json(doc);
});

module.exports = { listDocuments, createDocument };
