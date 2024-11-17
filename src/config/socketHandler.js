const conversationService = require("../services/conversationService");

exports.socketHandler = async (io) => {
  io.on("connection", (socket) => {
    console.log("A user has conected: ", socket.id);

    // Para crear una nueva conversacion
    socket.on("newConversation", async ({ newConversation }) => {
      try {
        const createConversation = await conversationService.addNewConversation(
          newConversation
        );

        io.emit("newConversation", createConversation);
      } catch (err) {
        console.log(err);
      }
    });

    // Para entrar a la conversacion
    socket.on("joinConversation", ({ id_conversation }) => {
      socket.join(id_conversation);
    });

    // Nuevos mensajes
    socket.on("newMessage", async ({ id_conversation, message }) => {
      const updateConversation = await conversationService.addMessage(
        id_conversation,
        message
      );

      io.to(id_conversation).emit("message", updateConversation);
    });

    // Desconectado
    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);
    });
  });
};
