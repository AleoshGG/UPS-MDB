//Importación de las dependencias
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    id_post: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Publication',
    },
    id_donor: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        require: true,
    },
});

const Comment = mongoose.model("Comments", commentSchema);

module.exports = Comment;