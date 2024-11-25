const Publication = require("../models/publication");
const os = require("os");
const path = require("path");
const fs = require("fs");
const stream = require("stream");
const driveService = require("../../configDrive");
const { authenticateJWT, getUserIdToken } = require("../config/tokens");

// Controlador para agregar una publicación
exports.addPublication = [
  authenticateJWT,
  // Middleware para autenticar al usuario antes de proceder
  async (req, res) => {
    try {
      // Obtener el token del encabezado de autorización
      const authHeader = req.headers.authorization;
      console.log(authHeader);

      if (!authHeader) {
        return res
          .status(401)
          .send("No se ha proporcionado un token de autenticación.");
      }

      // Extraer el token y obtener el id_donee (ID del usuario)
      const token = authHeader.split(" ")[1];
      const id_donee = getUserIdToken(token); // Decodificar el token para obtener el ID del usuario

      if (!id_donee) {
        return res
          .status(403)
          .send("Token inválido o expirado. Inicia sesión nuevamente.");
      }

      // Preparamos el objeto de la publicación con el id_donee obtenido
      const publicationData = {
        ...req.body, // Tomamos todos los datos enviados en el cuerpo de la solicitud
        id_donee, // Asignamos el id_donee al campo de la publicación
      };

      // Creamos una nueva instancia del modelo Publication
      const publication = new Publication(publicationData);

      // Guardamos la publicación en la base de datos
      await publication.save();

      // Respondemos con la publicación recién creada
      res.status(201).json(publication);
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      res.status(400).json({ message: error.message });
    }
  },
];

// Obtener todas las publicaciones
exports.getAll = async (req, res) => {
  try {
    const publications = await Publication.find().limit(50);
    res.status(200).json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una publicación por id_donee
exports.getByDonee = [
  authenticateJWT,
  async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      console.log(authHeader);

      if (!authHeader) {
        return res
          .status(401)
          .send("No se ha proporcionado un token de autenticación.");
      }

      // Extraer el token y obtener el id_donee (ID del usuario)
      const token = authHeader.split(" ")[1];
      const id_donee = getUserIdToken(token); // Decodificar el token para obtener el ID del usuario

      if (!id_donee) {
        return res
          .status(403)
          .send("Token inválido o expirado. Inicia sesión nuevamente.");
      }

      const publications = await Publication.find({ id_donee });
      console.log(publications);

      res.status(200).json(publications);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
];

// Obtener una publicación por id
exports.getPublicationById = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication)
      return res.status(404).json({ message: "Publicación no encontrada" });
    res.status(200).json(publication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una publicación por id
exports.updatePublication = async (req, res) => {
  try {
    const publication = await Publication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!publication)
      return res.status(404).json({ message: "Publicación no encontrada" });
    res.status(200).json(publication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una publicación
exports.deletePublication = [
  authenticateJWT,
  async (req, res) => {
    try {
      const publication = await Publication.findByIdAndDelete(req.params.id);
      if (!publication)
        return res.status(404).json({ message: "Publicación no encontrada" });
      res.status(200).json({ message: "Publicación eliminada con éxito" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Eliminar una publicación
exports.deleteByDonee = [
  authenticateJWT,
  async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      console.log(authHeader);

      if (!authHeader) {
        return res
          .status(401)
          .send("No se ha proporcionado un token de autenticación.");
      }

      // Extraer el token y obtener el id_donee (ID del usuario)
      const token = authHeader.split(" ")[1];
      const id_donee = getUserIdToken(token); // Decodificar el token para obtener el ID del usuario

      if (!id_donee) {
        return res
          .status(403)
          .send("Token inválido o expirado. Inicia sesión nuevamente.");
      }
      const publication = await Publication.deleteMany({ id_donee: id_donee });
      if (!publication)
        return res.status(404).json({ message: "Publicación no encontrada" });
      res.status(200).json({ message: "Publicación eliminada con éxito" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Subir archivo a Google Drive
exports.uploadToDrive = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se proporcionó un archivo" });
  }

  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, req.file.originalname);

  try {
    fs.writeFileSync(filePath, req.file.buffer);

    const fileMetadata = { name: req.file.originalname };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath),
    };

    const uploadedFile = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    const fileId = uploadedFile.data.id;

    fs.unlinkSync(filePath);

    res.status(200).json({ fileId });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Error al subir el archivo" });
  }
};

// Descargar archivo de Google Drive
exports.downloadFromDrive = async (req, res) => {
  const { fileId } = req.params;

  try {
    const driveFile = await driveService.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "stream" }
    );

    const dataStream = new stream.PassThrough();
    driveFile.data
      .on("end", () => console.log("Descarga completada"))
      .on("error", (err) => {
        console.error("Error durante la descarga:", err);
        res.status(500).send("Error durante la descarga");
      })
      .pipe(dataStream);

    res.setHeader("Content-Disposition", (filename = "${fileId}.jpg"));
    dataStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Error al descargar el archivo" });
  }
};
