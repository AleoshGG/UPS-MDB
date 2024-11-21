const Conversation = require("../models/conversation");

exports.getConversationsByUser = async (id_user) => {
  return await Conversation.find({
    $or: [
      {
        id_donee: id_user,
      },
      {
        id_donor: id_user,
      },
    ],
  });
};

exports.addNewConversation = (conversation) => {
  return Conversation.create(conversation);
};

exports.addMessage = async (id_conversation, message) => {
  const conversation = await Conversation.findById(id_conversation);
  if (conversation) {
    conversation.messages.push(message);
    await conversation.save();
  }
  return conversation;
};
