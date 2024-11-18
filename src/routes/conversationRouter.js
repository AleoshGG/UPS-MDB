const Message = require("../models/message");
const Conversation = require("../models/conversation");
const express = require("express");
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate("messages");
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las conversaciones" });
  }
});

router.get("/:conversationId/messages", async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
});

router.post("", async (req, res) => {
  const { participants } = req.body;

  try {
    // Verificar si ya existe una conversación entre los participantes
    let conversation = await Conversation.findOne({
      participants: { $all: participants },
    });

    if (!conversation) {
      conversation = new Conversation({ participants, messages: [] });
      await conversation.save();
    }

    res.status(201).json(conversation);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error al crear la conversación" });
  }
});

module.exports = router;
