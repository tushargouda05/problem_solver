const express = require("express");
const Problem = require("../models/problem");
const protect = require("../middleware/authMiddleware");
const Solution = require("../models/Solution");

const router = express.Router();

//add solution to a problem
router.post("/:problemId", protect, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.problemId);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        const { content, image } = req.body;

        const newSolution = new Solution({
            problem: req.params.problemId,
            content,
            image,
            author: req.user.id
        });

        await newSolution.save();

        res.status(201).json(newSolution);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
//list solutions for a problem, no protect — guests can view
router.get("/:problemId", async (req, res) => {
    try {

    }



    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

//edit own solution
router.put("/:id", protect, async (req, res) => {
    try {

    }



    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

//delete own solution
router.delete("/:id", protect, async (req, res) => {
    try {

    }



    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;