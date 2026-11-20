const router = require("express").Router();
const controller = require("../controllers/conversationController");
router.get("/", controller.listConversations);
router.get("/:studentId", controller.getConversation);
router.post("/:studentId/messages", controller.addMessage);
router.patch("/:studentId/close", controller.closeConversation);
module.exports = router;
