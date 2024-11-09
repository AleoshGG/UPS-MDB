const express  = require("express");
const router = express.Router();
const { addComment, getAllComments }  = require ("../controllers/commentController");

router.post('addComment', addComment);
router.get('/', getAllComments);

module.exports = router;