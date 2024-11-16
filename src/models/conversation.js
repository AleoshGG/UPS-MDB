const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  id_donee: {
    type: Number,
    required: true,
    unique: true,
  },
  id_donor: {
    type: Number,
    required: true,
    unique: true,
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
