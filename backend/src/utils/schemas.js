const { z } = require("zod");

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Pending", "In Progress", "Completed"];

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("A valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});

const updateMeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  priority: z.enum(PRIORITIES).default("Medium"),
  status: z.enum(STATUSES).default("Pending"),
  dueDate: z.coerce.date().optional(),
  assignedToId: z.string().optional().nullable(),
});

// All fields optional for updates (PUT/PATCH).
const updateTaskSchema = createTaskSchema.partial();

const createDocumentSchema = z.object({
  name: z.string().trim().min(1, "Document name is required"),
  category: z.string().trim().optional(),
  fileType: z.string().trim().optional(),
});

module.exports = {
  PRIORITIES,
  STATUSES,
  signupSchema,
  loginSchema,
  updateMeSchema,
  createTaskSchema,
  updateTaskSchema,
  createDocumentSchema,
};
