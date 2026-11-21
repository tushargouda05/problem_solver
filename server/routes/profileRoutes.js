const express = require("express");
const mongoose = require("mongoose");
const Problem = require("../models/problem");
const Solution = require("../models/Solution");
const Comment = require("../models/comment");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const [posts, solutions, comments, reactionTotals] = await Promise.all([
            Problem.countDocuments({ author: userId }),
            Solution.countDocuments({ author: userId }),
            Comment.countDocuments({ author: userId }),
            Solution.aggregate([
                { $match: { author: userId } },
                {
                    $group: {
                        _id: null,
                        likes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
                        dislikes: { $sum: { $size: { $ifNull: ["$dislikes", []] } } }
                    }
                }
            ])
        ]);

        res.status(200).json({
            posts,
            solutions,
            comments,
            likes: reactionTotals[0]?.likes || 0,
            dislikes: reactionTotals[0]?.dislikes || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load profile stats" });
    }
});

module.exports = router;
