const Comment = require("../models/comment");
const { authenticateJWT, getUserIdToken } = require("../config/tokens");

// Crear un comentario (requiere autenticación)
exports.addComment = [
  authenticateJWT,
  async (req, res) => {
    try {
      // Obtener el token del encabezado de autorización
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send('No se ha proporcionado un token de autenticación.');
      }

      // Extraer el token y obtener el id_donor (decodificar el token)
      const token = authHeader.split(" ")[1];
      const id_donor = getUserIdToken(token);
      console.log(id_donor); // Decodificar el token para obtener el ID del donante

      if (!id_donor) {
        return res
          .status(403)
          .send("Token inválido o expirado. Inicia sesión nuevamente.");
      }

      // Obtener datos del cuerpo de la solicitud
      const { id_post, content } = req.body;

      // Crear el nuevo comentario incluyendo el id_donor
      const newComment = new Comment({
        id_post,
        id_donor: id_donor,
        content,
      });

      // Guardar el comentario en la base de datos
      await newComment.save();
      res
        .status(201)
        .json({ message: "Comentario agregado con éxito", newComment });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al agregar el comentario", error });
    }
  },
];

exports.getCommentsByPost = [
  authenticateJWT,
  async (req, res) => {
    try {
      const { id_post } = req.params;

      const comments = await Comment.find({ id_post });

      // Verificar si hay comentarios
      if (!comments || comments.length === 0) {
        return res.status(404).json({
          message: "No se encontraron comentarios para esta publicación.",
        });
      }

      // Responder con los comentarios encontrados
      res.status(200).json(comments);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los comentarios", error });
    }
  },
];

// Obtener un comentario por su ID (requiere autenticación)
exports.getCommentById = [
  authenticateJWT,
  async (req, res) => {
    try {
      const { id_comment } = req.params;

      const comment = await Comment.findById(id_comment).populate(
        "username",
        "username"
      );

      if (!comment) {
        return res.status(404).json({ message: "Comentario no encontrado." });
      }

      res.status(200).json(comment);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener el comentario", error });
    }
  },
];

// Editar un comentario (requiere autenticación)
exports.editComment = [
  authenticateJWT,
  async (req, res) => {
    try {
      const { id_comment } = req.params;
      const { content } = req.body;

      const updatedComment = await Comment.findByIdAndUpdate(
        id_comment,
        { content },
        { new: true }
      );

      if (!updatedComment) {
        return res
          .status(404)
          .json({ message: "Comentario no encontrado para actualizar." });
      }

      res
        .status(200)
        .json({ message: "Comentario actualizado con éxito", updatedComment });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al actualizar el comentario", error });
    }
  },
];

// Eliminar un comentario (requiere autenticación)
exports.deleteComment = [
  authenticateJWT,
  async (req, res) => {
    try {
      const { id_comment } = req.params;

      const deletedComment = await Comment.findByIdAndDelete(id_comment);

      if (!deletedComment) {
        return res
          .status(404)
          .json({ message: "Comentario no encontrado para eliminar." });
      }

      res
        .status(200)
        .json({ message: "Comentario eliminado con éxito", deletedComment });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el comentario", error });
    }
  },
];

exports.deleteAll = [
  authenticateJWT,
  async (req, res) => {
    try {
      // Obtener el token del encabezado de autorización
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .send("No se ha proporcionado un token de autenticación.");
      }

      // Extraer el token y obtener el id_donor (decodificar el token)
      const token = authHeader.split(" ")[1];
      const id_donor = getUserIdToken(token);
      console.log(id_donor); // Decodificar el token para obtener el ID del donante

      if (!id_donor) {
        return res
          .status(403)
          .send("Token inválido o expirado. Inicia sesión nuevamente.");
      }

      const deletedComment = await Comment.deleteMany({ id_donor: id_donor });

      res
        .status(200)
        .json({ message: "Comentario eliminado con éxito" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el comentario", error });
    }
  },
];
