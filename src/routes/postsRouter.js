const express = require("express");
const router = express.Router();
const {
  addPublication,
  getAll,
  getPublicationById,
  updatePublication,
  deletePublication
} = require("../controllers/postsController");

router.post("/add", addPublication); 
router.get("/", getAll); 
router.get("/:id", getPublicationById); 
router.put("/:id", updatePublication); 
router.delete("/:id", deletePublication); 

module.exports = router;
