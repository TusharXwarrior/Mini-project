const express = require("express");
const router = express.Router();
const {
  getProgressHistory,
  recordProgress,
  getProgressComparison,
} = require("../controllers/progressController");

router.route("/:studentId").get(getProgressHistory).post(recordProgress);
router.route("/:studentId/comparison").get(getProgressComparison);

module.exports = router;
