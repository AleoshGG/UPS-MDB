const Conversation = require("../models/conversation");

exports.createConversation = async (id_donor, id_donee) => {
  const newConversation = new Conversation({
    id_donor: id_donor,
    id_donee: id_donee,
  });
  try {
    await newConversation.save();
  } catch (err) {
    console.log(err);
  }
};
