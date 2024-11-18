const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: {
    id_donor: {
      type: Number,
      require: true,
    },
    id_donee: {
      type: Number,
      require: true,
    },  
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
