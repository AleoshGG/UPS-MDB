const express = require("express");
const router = express.Router();

router.get("/chat", (req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

module.exports = router;