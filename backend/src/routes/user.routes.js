const { Router } = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { updateMeSchema } = require("../utils/schemas");
const { listUsers, updateMe } = require("../controllers/user.controller");

const router = Router();

router.use(auth); // all user routes require authentication

router.get("/", listUsers);
router.patch("/me", validate(updateMeSchema), updateMe);

module.exports = router;
