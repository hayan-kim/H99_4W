const mongoose = require("mongoose");

const boardSchema = mongoose.Schema({
    boardId: {
        type: Number,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
        
    },
});


module.exports = mongoose.model("boards", boardSchema);