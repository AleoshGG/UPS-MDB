const Message = require("../models/message");

exports.addMessage = async (user, msg) => {
  const newMessage = new Message({
    content: msg,
    user: user,
  });
  try {
    await newMessage.save();
  } catch (err) {
    console.log(err);
  }
};

exports.getMessages = async () => {
  try {
    return Message.find();
  } catch (err) {
    console.log(err);
  }
};
