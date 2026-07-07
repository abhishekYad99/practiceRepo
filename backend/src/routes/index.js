const { Router } = require("express");

const router = Router();

router.use("/auth", require("./auth.routes"));
router.use("/users", require("./user.routes"));
router.use("/tasks", require("./task.routes"));
router.use("/documents", require("./document.routes"));
router.use("/dashboard", require("./dashboard.routes"));

module.exports = router;
