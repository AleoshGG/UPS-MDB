// Importamos las dependencias
require("dotenv").config();
const express = require("express");
const connection = require("./src/config/connetion");
const logger = require("morgan");
const { Server } = require("socket.io");
const nodeHttp = require("node:http");
const { socketHandler } = require("./src/config/socketHandler");

// Importar las rutas
const publicactionRouter = require("./src/routes/postsRouter");
const commentRouter = require("./src/routes/commentRouter");
const chatRouter = require("./src/routes/chatRouter");
const conversationRouter = require("./src/routes/conversationRouter");

connection();

//Creacion de la apicacion
const app = express();
const server = nodeHttp.createServer(app);
const io = new Server(server);

socketHandler(io);

app.use(logger("dev"));
app.use(express.json());

// Declarar las rutas
app.use("/publications", publicactionRouter);
app.use("/comments", commentRouter);
app.use("/chats", chatRouter);
app.use("/conversations", conversationRouter);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
