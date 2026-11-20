const router = require("express").Router();
const controller = require("../controllers/progressController");
router.get("/:studentId", controller.getProgress);
router.post("/:studentId", controller.addProgress);
module.exports = router;
