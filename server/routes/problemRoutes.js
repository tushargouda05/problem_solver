const express = require("express");
const Problem = require("../models/problem");
const protect = require("../middleware/authMiddleware");

const moderateContent = require("../utils/moderateText");

const router = express.Router();

// Create a problem
const applyModeration = require("../utils/applyModeration");

router.post("/", protect, async (req, res) => {
    try {
        const { title, description, category, image } = req.body;

        const { action } = await applyModeration({
            userId: req.user.id,
            contentType: "Problem",
            text: `${title} ${description}`
        });

        if (action === "blocked") {
            return res.status(400).json({ message: "Your content violates community guidelines and was not posted." });
        }

        const newProblem = new Problem({
            title,
            description,
            category,
            image,
            author: req.user.id,
            isFlagged: action === "flagged"
        });

        await newProblem.save();

        res.status(201).json(newProblem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// Get all problems
router.get("/", async (req, res) => {
    try {
        const { category, search, author } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (search) filter.title = { $regex: search, $options: "i" };
        if (author) filter.author = author;

        const problems = await Problem.find(filter).populate("author", "username").sort({ createdAt: -1 });

        res.status(200).json(problems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get a single problem
router.get("/:id", async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id).populate("author", "username");
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json(problem);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Edit a problem
router.put("/:id", protect, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        if (problem.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to edit this problem" });
        }

        const { title, description, category, image } = req.body;
        const scores = await moderateContent(title + " " + description);

        if (scores.toxicity > 0.8 || scores.insult > 0.8) {
            return res.status(400).json({ message: "Your content violates community guidelines and was not posted." });
        }

        if (title) problem.title = title;
        if (description) problem.description = description;
        if (category) problem.category = category;
        if (image) problem.image = image;
        await problem.save();
        res.status(200).json(problem);

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }

});

// Delete a problem
router.delete("/:id", protect, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        if (problem.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to edit this problem" });
        }
        await problem.deleteOne();
        res.status(200).json({ message: "Problem deleted" });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;