// Importamos las dependencias
require('dotenv').config();
const express = require('express');
const connection = require('./src/config/config');
const PORT = process.env.PORT;

connection();
const app = express();
app.use(express.json());

// Importar las rutas

// Declarar las rutas

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});