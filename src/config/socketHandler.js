const { addMessage, getMessages } = require("../controllers/messageController");

exports.socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log("A user has conected");

    socket.on("disconnect", () => {
      console.log("Conexion cerrada");
    });

    socket.on("chat message", async (msg) => {
      const user = socket.handshake.auth.user;
      try {
        await addMessage(user, msg);
        await io.emit("chat message", msg, user);
      } catch (err) {
        console.log(err);
      }
    });

    if (!socket.recovered) {
      try {
        const messages = await getMessages();
        messages.forEach((message) => {
          socket.emit("chat message", message.content, message.user);
        });
      } catch (err) {
        console.log(err);
      }
    }
  });
};
