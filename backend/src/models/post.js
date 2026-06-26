const mongoose = require('mongoose');

const postschema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: String,
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ]
});

module.exports = mongoose.model("post", postschema);
