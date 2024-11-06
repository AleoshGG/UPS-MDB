const authenticateJWT = require("../config/authenticateJWT");
const Publication = require("../models/publication");

exports.addPublication = [
  authenticateJWT,
  async (req, res) => {
    const publication = req.body;

    try {
      post = new Publication(publication);
      await post.save();

      res.status(201).json({ msg: "Success" });
    } catch (err) {
      console.error(`Error has occurred: ${err}`);
      res.status(500).json({
        msg: "An error occurred while creating the publication",
        error: err.message,
      });
    }
  },
];

exports.getAll = [
  authenticateJWT,
  async (req, res) => {
    try {
      const posts = await Publication.find();

      res.status(200).json(posts);
    } catch (err) {
      console.error(`Error has occurred: ${err}`);
      res.status(500).json({
        msg: "An error occurred while getting the publication",
        error: err.message,
      });
    }
  },
];
