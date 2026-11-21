const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        targetType: {
            type: String,
            required: true,
            enum: ["Problem", "Solution"],
        },

        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Comment", commentSchema, "pscomments");
