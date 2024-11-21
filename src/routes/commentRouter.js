const express = require("express");

const router = express.Router();

const {
  addComment,
  getCommentsByPost,
  getCommentById,
  editComment,
  deleteComment,
} = require("../controllers/commentController");

router.post("/add", addComment);
router.get("/post/:id_post", getCommentsByPost);
router.get("/:id_comment", getCommentById);
router.put("/:id_comment", editComment);
router.delete("/:id_comment", deleteComment);

module.exports = router;