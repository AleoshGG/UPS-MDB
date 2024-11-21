const Message = require("../models/message");
const Conversation = require("../models/conversation");

exports.socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log("A user has conected");

    // Unirse a una conversación
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`Usuario unido a la conversación: ${conversationId}`);
    });

    // Enviar un mensaje
    socket.on("sendMessage", async ({ content, senderId, conversationId }) => {

      try {
        // Crear y guardar el mensaje
        const newMessage = new Message({ content, senderId, conversationId });
        await newMessage.save();

        // Agregar el mensaje a la conversación
        const conversation = await Conversation.findById(conversationId);
        conversation.messages.push(newMessage._id);
        await conversation.save();

        // Emitir el mensaje a todos los usuarios en la conversación
        io.to(conversationId).emit("newMessage", newMessage);
      } catch (err) {
        console.error("Error al enviar el mensaje:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Un usuario se ha desconectado");
    });
  });
};
