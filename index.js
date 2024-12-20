// Importamos las dependencias
require("dotenv").config();
const express = require("express");
const connection = require("./src/config/connetion");
const logger = require("morgan");
const Socket = require("socket.io");
const nodeHttp = require("node:http");
const socketHandler = require("./src/config/socketHandler");
const cors = require("cors");
const PORT = process.env.PORT;

connection();

//Creacion de la apicacion
const app = express();
const server = nodeHttp.createServer(app);
const io = new Socket.Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: [
      "https://unidosporlasangre.integrador.xyz",
      "http://localhost:4200",
    ], // Especifica el origen permitido
    methods: ["GET", "POST", "DELETE", "PUT"], // Métodos HTTP permitidos
    credentials: true,
  },
});

socketHandler.socketHandler(io);

app.use(logger("dev"));
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://unidosporlasangre.integrador.xyz",
      "http://localhost:4200",
    ], // Agrega aquí los orígenes permitidos
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
// Importar las rutas
const publicactionRouter = require("./src/routes/postsRouter");
const commentRouter = require("./src/routes/commentRouter");
const checkRouter = require("./src/routes/checkJWTRouter");
const conversationRouter = require("./src/routes/conversationRouter");

// Declarar las rutas
app.use("/publications", publicactionRouter);
app.use("/comments", commentRouter);
app.use("/check", checkRouter);
app.use("/conversations", conversationRouter);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
