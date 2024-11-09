const authenticateJWT = require("../config/authenticateJWT");
const Comment = require("../models/comment");

exports.addComment = [
    authenticateJWT,
    async (req, res) => {
        const comment = req.body;

        try {
            comment = new Comment(comment); 
            await comment.save();

            res.status(201).json({msg: "Sucess"});
        } catch (err) {
            console.error(`Error has occurred: ${err}`);
            res.status(500).json({
                msg: "An error ocurred while creating the comment",
                error: err.message,
            });
        }
    },
];

exports.getAllComments = [
    authenticateJWT,
    async (req, res) => {
        try {
          const comments = await Comment.find();
    
          res.status(200).json(comments);
        } catch (err) {
          console.error(`Error has occurred: ${err}`);
          res.status(500).json({
            msg: "An error occurred while getting the publication",
            error: err.message,
          });
        }
      },
];