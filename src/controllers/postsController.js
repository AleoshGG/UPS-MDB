const Publication = require("../models/publication");

// Crear una nueva publicación
exports.addPublication = async (req, res) => {
  try {
    const publication = new Publication(req.body);
    await publication.save();
    res.status(201).json(publication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las publicaciones
exports.getAll = async (req, res) => {
  try {
    const publications = await Publication.find();
    res.status(200).json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una publicación por id
exports.getPublicationById = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) return res.status(404).json({ message: "Publicación no encontrada" });
    res.status(200).json(publication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una publicación por id
exports.updatePublication = async (req, res) => {
  try {
    const publication = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!publication) return res.status(404).json({ message: "Publicación no encontrada" });
    res.status(200).json(publication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una publicación
exports.deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);
    if (!publication) return res.status(404).json({ message: "Publicación no encontrada" });
    res.status(200).json({ message: "Publicación eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
