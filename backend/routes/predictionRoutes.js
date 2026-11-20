const router = require("express").Router();
const { getModelStatus, predictStudent, predictAllStudents } = require("../controllers/predictionController");
router.get("/model-status", getModelStatus);
router.get("/summary", predictAllStudents);
router.get("/:id", predictStudent);
module.exports = router;
