const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

const {
  addPublication,
  getAll,
  getPublicationById,
  updatePublication,
  deletePublication,
  downloadFromDrive,
  uploadToDrive,
  deleteByDonee,
  getByDonee,
} = require("../controllers/postsController");

router.post("/add", addPublication);
router.get("/all", getAll);
router.get("/:id", getPublicationById);
router.get("/", getByDonee);
router.put("/:id", updatePublication);
router.delete("/:id", deletePublication);
router.delete("/", deleteByDonee);

//rutas para drive

// Ruta para subir un archivo a Google Drive
router.post("/upload", upload.single("file"), uploadToDrive);

// Ruta para descargar un archivo desde Google Drive
router.get("/download/:fileId", downloadFromDrive);

module.exports = router;
