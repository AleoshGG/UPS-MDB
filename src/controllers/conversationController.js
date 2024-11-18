const Message = require("../models/message");
const Conversation = require("../models/conversation");

exports.createConversation = async (req, res) => {
  const { participants } = req.body;
  const { id_donee, id_donor } = participants;

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
};

exports.getChatsDonee = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.find({
      $and: [{ "participants.id_donee": userId }],
    }).populate("messages");
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las conversaciones" });
  }
};

exports.getChatsDonor = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.find({
      $and: [{ "participants.id_donor": userId }],
    }).populate("messages");
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las conversaciones" });
  }
};

exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};
