const conversationService = require("../services/conversationService");

exports.getConversations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await conversationService.getConversationsByUser(
      userId
    );
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({
      msg: err,
    });
    return;
  }
};

exports.createConversation = async (req, res) => {
  try {
    const newConversation = req.body;

    if (!newConversation.id_donee || !newConversation.id_donor) {
      return res.status(400).json({ msg: "Faltan campos" });
    }

    const response = await conversationService.addNewConversation(
      newConversation
    );
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({
      msg: err,
    });
    return;
  }
};
