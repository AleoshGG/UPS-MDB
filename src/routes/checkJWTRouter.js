const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../config/tokens");

router.get("/", [
  authenticateJWT,
  (req, res) => {
    return res.status(200).json({ message: "Request successful!" });
  },
]);

module.exports = router;
