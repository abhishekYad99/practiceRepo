const { Router } = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createDocumentSchema } = require("../utils/schemas");
const { listDocuments, createDocument } = require("../controllers/document.controller");

const router = Router();

router.use(auth); // all document routes require authentication

router.get("/", listDocuments);
router.post("/", validate(createDocumentSchema), createDocument);

module.exports = router;
