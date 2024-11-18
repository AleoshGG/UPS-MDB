const express = require("express");
const router = express.Router();

const {
  createConversation,
  getChatsDonee,
  getChatsDonor,
  getMessages,
} = require("../controllers/conversationController");

router.get("/donee/:userId", getChatsDonee);
router.get("/donor/:userId", getChatsDonor);
router.get("/:conversationId/messages", getMessages);
router.post("", createConversation);

module.exports = router;
