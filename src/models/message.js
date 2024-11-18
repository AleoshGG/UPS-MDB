const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String, // Donor or Donee
    require: true,
  },
  receiverId: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
