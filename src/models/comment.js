//Importación de las dependencias
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    id_comment: {
        type: Number,
        require: true,
        unique: true
    },
    id_post: {
        type: Number,
        require: true,
        ref: 'publication',
        unique: true
    },
    username: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        unique: true
    },
    content: {
        type: String,
        require: true,
    },
});

const Comment = mongoose.model("Comments", commentSchema);

module.exports = Comment;