const express = require("express");
const router = express.Router();
const {
  getConversation,
  sendMessage,
  getAiSuggestedResponses,
} = require("../controllers/conversationController");

router.route("/:studentId").get(getConversation);
router.route("/:studentId/messages").post(sendMessage);
router.route("/:studentId/ai-suggest").post(getAiSuggestedResponses);

module.exports = router;
