const Message = require("../models/message");
const Conversation = require("../models/conversation");
const { authenticateJWT, getUserIdToken } = require("../config/tokens");

exports.createConversation = [
  authenticateJWT,
  async (req, res) => {
    const id_donor = req.params.id;
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    let id_donee;
    if (authHeader) {
      const token = authHeader.split(" ")[1];

      id_donee = getUserIdToken(token);
      console.log(id_donee);
    }
    console.log(id_donor);

    const participants = {
      id_donor: id_donor,
      id_donee: id_donee,
    };

    try {
      // Verificar si ya existe una conversación entre los participantes
      let conversation = await Conversation.findOne({
        $or: [
          {
            "participants.id_donee": id_donee,
            "participants.id_donor": id_donor,
          },
          {
            "participants.id_donee": id_donor,
            "participants.id_donor": id_donee,
          },
        ],
      });

      if (conversation) {
        console.log("Conversación existente:", conversation);
        return res.status(400).json({ msg: "Conversacion existente" });
      }

      if (!conversation) {
        conversation = new Conversation({ participants, messages: [] });
        await conversation.save();
      }

      return res.status(201).json(conversation);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error al crear la conversación" });
    }
  },
];

exports.getChatsDonee = [
  authenticateJWT,
  async (req, res) => {
    const authHeader = req.headers.authorization;

    let userId;
    if (authHeader) {
      const token = authHeader.split(" ")[1];

      userId = getUserIdToken(token);
    }

    try {
      const conversations = await Conversation.find({
        $and: [{ "participants.id_donee": userId }],
      }).populate("messages");
      res.status(200).json(conversations);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener las conversaciones" });
    }
  },
];

exports.getChatsDonor = [
  authenticateJWT,
  async (req, res) => {
    const authHeader = req.headers.authorization;
    let userId;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      userId = getUserIdToken(token);
    }

    try {
      const conversations = await Conversation.find({
        $and: [{ "participants.id_donor": userId }],
      }).populate("messages");
      res.status(200).json(conversations);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener las conversaciones" });
    }
  },
];

exports.getMessages = [
  authenticateJWT,
  async (req, res) => {
    const { conversationId } = req.params;

    try {
      const messages = await Message.find({ conversationId });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener los mensajes" });
    }
  },
];
