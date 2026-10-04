const mongoose = require("mongoose");

const moderationHistorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        contentType: {
            type: String,
            required: true,
            enum: ["Problem", "Solution", "Comment"]
        },
        contentText: {
            type: String,
            required: true
        },
        scores: {
            type: Object,
            required: true
        },
        action: {
            type: String,
            required: true,
            enum: ["allowed", "flagged", "blocked"]
        },
        trustScoreChange: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ModerationHistory", moderationHistorySchema);