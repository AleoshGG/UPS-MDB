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
    origin: "http://localhost:4000", // Especifica el origen permitido
    methods: ["GET", "POST"], // Métodos HTTP permitidos
  },
});

socketHandler.socketHandler(io);

app.use(logger("dev"));
app.use(express.json());
app.use(cors()); // Permite todas las solicitudes

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
