const express = require("express");
const router = express.Router();
const { addPublication, getAll } = require("../controllers/postsController");

router.post('/add', addPublication);
router.get('/', getAll);

module.exports = router;
