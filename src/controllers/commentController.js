const { authenticateJWT } = require("../config/tokens");
const Comment = require("../models/comment");

// Crear un comentario (requiere autenticación)
exports.addComment = [
  authenticateJWT,
  async (req, res) => {
    try {
      const { id_comment, id_post, username, content } = req.body;

      const newComment = new Comment({
        id_comment,
        id_post,
        username,
        content,
      });

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

// Obtener todos los comentarios de una publicación específica (requiere autenticación)
exports.getCommentsByPost = [
  authenticateJWT,
  async (req, res) => {
    try {
      const { id_post } = req.params;

      const comments = await Comment.find({ id_post }).populate(
        "username",
        "username"
      );

      if (!comments) {
        return res.status(404).json({
          message: "No se encontraron comentarios para esta publicación.",
        });
      }

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
