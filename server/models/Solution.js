const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema(
    {
        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true,
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: String,
            required: true,
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },

        dislikes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        image: {
            type: String
        },
        editHistory: [{ content: String, editedAt: { type: Date, default: Date.now } }],
        isFlagged: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Solution", solutionSchema);