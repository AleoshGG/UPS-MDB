const express = require("express");
const router = express.Router();

const {
  createConversation,
  getChatsDonee,
  getChatsDonor,
  getMessages,
} = require("../controllers/conversationController");

router.get("/donee", getChatsDonee);
router.get("/donor", getChatsDonor);
router.get("/messages/:conversationId", getMessages);
router.get("/add/:id", createConversation);

module.exports = router;
