const authenticateJWT = require("../config/authenticateJWT");
const Publication = require("../models/publication");
const uploadFile = require("../config/connectionsS3");
const multer = require("multer");

const stogare = multer.memoryStorage();
const upload = multer({ stogare: stogare });

exports.addPublication = [
  authenticateJWT,  // Autenticación de JWT
  upload.single("image"),  // Manejo de la carga de la imagen
  async (req, res) => {
    // Verificar si el archivo ha sido subido
    if (!req.file) {
      return res.status(400).json({ msg: "No image file uploaded" });
    }

    try {
      // Crear el archivo en S3
      const filePath = `publications/${Date.now()}_${req.file.originalname}`;
      const data = await uploadFile(req.file.buffer, filePath); // Subir el archivo a S3

      // Crear la publicación con los datos de la solicitud
      const publication = new Publication({
        ...req.body,  // Extiende los datos del cuerpo de la solicitud
        image: data.Location,  // Agrega la URL de la imagen
      });

      // Guardar la publicación en la base de datos
      await publication.save();

      // Respuesta exitosa
      res.status(201).json({ msg: "Publication created successfully" });

    } catch (err) {
      // Manejo de errores
      console.error(`Error has occurred: ${err}`);
      res.status(500).json({
        msg: "An error occurred while creating the publication",
        error: err.message,
      });
    }
  },
];

exports.getAll = [
  authenticateJWT,
  async (req, res) => {
    try {
      const posts = await Publication.find();

      res.status(200).json(posts);
    } catch (err) {
      console.error(`Error has occurred: ${err}`);
      res.status(500).json({
        msg: "An error occurred while getting the publication",
        error: err.message,
      });
    }
  },
];
