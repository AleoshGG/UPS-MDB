require('dotenv').config();
const mongoose = require('mongoose');

const DB_URI = process.env.DB_URI;

// Inicio de la conexion
const connection = async () => {
    try {
        await mongoose.connect(DB_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true
            });
        console.log('Connection established');
    } catch (err) {
        console.log(`Error has occurred ${err}`);
    }
};

module.exports = connection;