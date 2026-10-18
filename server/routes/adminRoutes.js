
const express = require("express");
const router = express.Router();

const  protect  = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const User = require("../models/user");
const Problem = require("../models/problem");
const Solution = require("../models/Solution");
const Comment = require("../models/comment");
const ModerationHistory = require("../models/moderationHistory");

router.get("/flagged", protect, isAdmin, async (req, res) => {
    try { const problems = await Problem.find({ isFlagged: true }).populate("author", "username"); const solutions = await Solution.find({ isFlagged: true }).populate("author", "username"); const comments = await Comment.find({ isFlagged: true }).populate("author", "username"); res.status(200).json({ problems, solutions, comments }); } catch (err) {
        console.error(err); res.status(500).json({
            message: "Server error"
        });
    }
});

router.get("/history", protect, isAdmin, async (req, res) => {
    try { const history = await ModerationHistory.find().populate("user", "username").sort({ createdAt: -1 }).limit(100); res.status(200).json(history); } catch (err) {
        console.error(err); res.status(500).json({
            message: "Server error"
        });
    }
});

router.get("/users", protect, isAdmin, async (req, res) => {
    try { const users = await User.find().select("-password").sort({ trustScore: 1 }); res.status(200).json(users); } catch (err) {
        console.error(err); res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;

