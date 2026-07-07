const { Router } = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createTaskSchema, updateTaskSchema } = require("../utils/schemas");
const {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

const router = Router();

router.use(auth); // all task routes require authentication

router.get("/", listTasks);
router.post("/", validate(createTaskSchema), createTask);
router.get("/:id", getTask);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
