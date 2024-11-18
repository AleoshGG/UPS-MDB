const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: {
    type: [String], // Almacena los IDs de los dos usuarios
    required: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
