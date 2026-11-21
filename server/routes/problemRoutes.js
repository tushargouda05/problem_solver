const express = require("express");
const Problem = require("../models/problem");
const User = require("../models/user");
const protect = require("../middleware/authMiddleware");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const router = express.Router();

// Create a problem

router.post("/", protect, async (req, res) => {
    try {
        const { title, description, category, image } = req.body;

        const newProblem = new Problem({
            title,
            description,
            category,
            image,
            author: req.user.id
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
        if (category) filter.category = String(category);
        const appUserIds = await User.distinct("_id");
        const requestedAuthor = author && appUserIds.some((userId) => userId.toString() === String(author));
        filter.author = author
            ? (requestedAuthor ? author : { $in: [] })
            : { $in: appUserIds };
        if (search) filter.title = { $regex: escapeRegex(String(search)), $options: "i" };

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
        if (!problem || !problem.author) {
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



        if (title) problem.title = title;
        if (description) problem.description = description;
        if (category) problem.category = String(category);
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
