const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
