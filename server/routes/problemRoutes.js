const express = require("express");
const Problem = require("../models/problem");
const protect  = require("../middleware/authMiddleware");

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
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// Get all problems
router.get("/",async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {}; if (category) filter.category = category;
         if (search) filter.title = { $regex: search, $options: "i" };
         const problems = await Problem.find(filter).populate("author", "username").sort({ createdAt: -1 });
         
         res.status(200).json(problems);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get a single problem
router.get("/:id", async(req, res) => {
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
router.put("/:id", protect, (req, res) => {
    res.send("edit problem endpoint");
});

// Delete a problem
router.delete("/:id", protect, (req, res) => {
    res.send("delete problem endpoint");
});

module.exports = router;