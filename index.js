// Importamos las dependencias
require("dotenv").config();
const express = require("express");
const connection = require("./src/config/config");
const logger = require("morgan");
const Socket = require("socket.io");
const nodeHttp = require("node:http");
const PORT = process.env.PORT;
const socketHandler = require("./src/config/socketHandler");
const cors = require("cors");
connection();

//Creacion de la apicacion
const app = express();
const server = nodeHttp.createServer(app);
const io = new Socket.Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:4200", // Especifica el origen permitido
    methods: ["GET", "POST"], // Métodos HTTP permitidos
  },
});

socketHandler.socketHandler(io);

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

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
