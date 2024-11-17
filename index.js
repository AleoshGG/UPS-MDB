// Importamos las dependencias
require("dotenv").config();
const express = require("express");
const connection = require("./src/config/config");
const logger = require("morgan");
const Socket = require("socket.io");
const nodeHttp = require("node:http");
const PORT = process.env.PORT;
const socketHandler = require("./src/config/socketHandler");
connection();

//Creacion de la apicacion
const app = express();
const server = nodeHttp.createServer(app);
const io = new Socket.Server(server, {
  connectionStateRecovery: {},
});

socketHandler.socketHandler(io);

app.use(logger("dev"));
app.use(express.json());

// Importar las rutas
const publicactionRouter = require("./src/routes/postsRouter");
const commentRouter = require("./src/routes/commentRouter");
const chatRouter = require("./src/routes/chatRouter");

// Declarar las rutas
app.use("/publications", publicactionRouter);
app.use("/comments", commentRouter);
app.use("/chats", chatRouter);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
