const { Router } = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { signupSchema, loginSchema } = require("../utils/schemas");
const { signup, login, me } = require("../controllers/auth.controller");

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", auth, me);

module.exports = router;
