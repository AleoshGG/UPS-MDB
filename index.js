// Importamos las dependencias
require("dotenv").config();
const express = require("express");
const connection = require("./src/config/config");
const cors = require("cors")
const PORT = process.env.PORT;

connection();
const app = express();
app.use(express.json());
app.use(cors())

// Importar las rutas
const publicactionRouter = require("./src/routes/postsRouter");
const commentRouter = require("./src/routes/commentRouter");

// Declarar las rutas
app.use("/publications", publicactionRouter);
app.use("/comments", commentRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
