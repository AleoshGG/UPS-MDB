const express = require("express");
const router = express.Router();
const {
  getConversations,
  createConversation,
} = require("../controllers/conversationController");

router.get("/:userId", getConversations);
router.post("/add", createConversation);

module.exports = router;
