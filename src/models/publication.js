// Importacion de dependencia
const mongoose = require("mongoose");

const publication = new mongoose.Schema({
  id_donee: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date_limit: {
    type: Date,
    required: true,
  },
  blood_type: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  donors_number: {
    type: Number,
    default: 0
  },
});

module.exports = publication;