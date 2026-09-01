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
router.get("/", (req, res) => {
    res.send("get all problems endpoint");
});

// Get a single problem
router.get("/:id", (req, res) => {
    res.send("get single problem endpoint");
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