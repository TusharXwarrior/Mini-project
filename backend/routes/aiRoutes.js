const router = require("express").Router();
const { counsellingSuggestion } = require("../controllers/aiController");
router.post("/counselling-suggestion/:studentId", counsellingSuggestion);
module.exports = router;
