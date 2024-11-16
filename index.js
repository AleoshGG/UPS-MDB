// Importamos las dependencias
require("dotenv").config();
const express = require("express");
const connection = require("./src/config/config");
const logger = require("morgan");
const Socket = require("socket.io");
const nodeHttp = require("node:http");
const PORT = process.env.PORT;
connection();

//Creacion de la apicacion
const app = express();
const server = nodeHttp.createServer(app);
const io = new Socket.Server(server);

io.on("connection", (socket) => {
  console.log("A user has conected");

  socket.on("disconnect", () => {
    console.log("Conexion cerrada");
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

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
