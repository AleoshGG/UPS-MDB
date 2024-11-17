const Message = require("../models/message");

exports.socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log("A user has conected");

    socket.on("disconnect", () => {
      console.log("Conexion cerrada");
    });

    socket.on("chat message", async (msg) => {
      const user = socket.handshake.auth.user;
      const newMessage = new Message({
        content: msg,
        user: user,
      });
      try {
        await newMessage.save();
      } catch (err) {
        console.log(err);
      }
      io.emit("chat message", msg, newMessage.id.toString(), user);
    });

    if (!socket.recovered) {
      try {
        const id = socket.handshake.auth.serverOffset;
        const messages = await Message.find();
        messages.forEach((message) => {
          socket.emit("chat message", message.content, message.user);
        });
      } catch (err) {
        console.log(err);
      }
    }
  });
};
