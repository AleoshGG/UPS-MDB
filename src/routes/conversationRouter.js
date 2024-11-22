const express = require("express");
const router = express.Router();

const {
  createConversation,
  getChatsDonee,
  getChatsDonor,
  getMessages,
  deleteForDonees,
  deleteForDonors,
} = require("../controllers/conversationController");

router.get("/donee", getChatsDonee);
router.get("/donor", getChatsDonor);
router.get("/messages/:conversationId", getMessages);
router.get("/add/:id", createConversation);
router.delete("/forDonee", deleteForDonees);
router.delete("/forDonor", deleteForDonors);

module.exports = router;
