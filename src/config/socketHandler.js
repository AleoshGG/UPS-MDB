const { addMessage, getMessages } = require("../controllers/messageController");
const { createConversation } = require("../controllers/conversationController");

const users = {};

exports.socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log("A user has conected");

    socket.on("disconnect", () => {
      console.log("Conexion cerrada");
    });

    socket.on("register", (userId) => {
      users[userId] = socket.id;
    });

    socket.on("private message", async ({ senderId, receiverId, content }) => {
      const receiverSocketId = users[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("private message", {
          senderId,
          content,
          date: new Date(),
        });
        await addMessage({ senderId, receiverId, content });
      }
    });

    socket.on("disconnect", () => {
    console.log("A user disconnected");
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
    /*     // Crear una nueva conversación
    socket.on("Conversarion", async (id_donor, id_donee) => {
      try {
        await createConversation(id_donor, id_donee);
        await io.emit("Conversation", id_donor, id_donee);
      } catch (err) {
        console.log(err);
      }
    }); */

    // Esto es para añadir un nuevo mensaje
    /* socket.on("chat message", async (msg) => {
      const user = socket.handshake.auth.user;
      try {
        await addMessage(user, msg);
        await io.emit("chat message", msg, user);
      } catch (err) {
        console.log(err);
      }
    }); */

    // Para sacar todos los mensajes
    // if (!socket.recovered) {
    //   try {
    //     const messages = await getMessages();
    //     messages.forEach((message) => {
    //       socket.emit("chat message", message.content, message.user);
    //     });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
  });
};
