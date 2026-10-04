const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        image: {
            type: String
        },
        isFlagged: { type: Boolean, default: false }
    },
    {
        timestamps: true
    },
    
);

module.exports = mongoose.model("Problem", problemSchema);