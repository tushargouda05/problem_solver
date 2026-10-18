const express = require("express");
const Problem = require("../models/problem");

const protect = require("../middleware/authMiddleware");
const Solution = require("../models/Solution");
const Notification = require("../models/notification");
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const router = express.Router();

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

        if (problem.author.toString() !== req.user.id) {
            await Notification.create({
                recipient: problem.author,
                message: `Someone answered your problem: "${problem.title}"`,
                relatedProblem: problem._id
            });
        }

        res.status(201).json(newSolution);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/:id", protect, async (req, res) => {
    try {
        const solution = await Solution.findById(req.params.id);
        if (!solution) {
            return res.status(404).json({ message: "solution not found" });
        }
        if (solution.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to edit this solution" });
        }

        const { content, image } = req.body;

        if (content && content !== solution.content) {
            solution.editHistory.push({ content: solution.content });
            solution.content = content;
        }
        if (image) solution.image = image;

        await solution.save();
        res.status(200).json(solution);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


//list solutions for a problem, no protect — guests can view
router.get("/:problemId", async (req, res) => {
    try {
        const { problemId } = req.params;
        const { search } = req.query;
        const filter = { problem: problemId };
        if (search) filter.content = { $regex: escapeRegex(String(search)), $options: "i" }; 

        const solutions = await Solution.find(filter)
            .populate("author", "username")
            .sort({ createdAt: 1 });

        res.status(200).json(solutions);

    }



    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});





//delete own solution
router.delete("/:id", protect, async (req, res) => {
    try {
        const solution = await Solution.findById(req.params.id);
        if (!solution) {
            return res.status(404).json({ message: "solution not found" });
        }
        if (solution.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this solution" });
        }
        await solution.deleteOne();
        res.status(200).json({ message: "Solution deleted" });


    }



    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// Like a solution
router.post("/:id/like", protect, async (req, res) => {
    try {
        const solution = await Solution.findById(req.params.id);

        if (!solution) {
            return res.status(404).json({
                message: "Solution not found",
            });
        }

        const userId = req.user.id;

        const alreadyLiked = solution.likes.some(
            id => id.toString() === userId
        );

        if (alreadyLiked) {
            // Toggle off
            solution.likes = solution.likes.filter(
                id => id.toString() !== userId
            );
        } else {
            // Add like
            solution.likes.push(userId);

            // Remove existing dislike
            solution.dislikes = solution.dislikes.filter(
                id => id.toString() !== userId
            );
        }

        await solution.save();

        res.status(200).json(solution);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error",
        });
    }
});


// Dislike a solution
router.post("/:id/dislike", protect, async (req, res) => {
    try {
        const solution = await Solution.findById(req.params.id);

        if (!solution) {
            return res.status(404).json({
                message: "Solution not found",
            });
        }

        const userId = req.user.id;

        const alreadyDisliked = solution.dislikes.some(
            id => id.toString() === userId
        );

        if (alreadyDisliked) {
            // Toggle off
            solution.dislikes = solution.dislikes.filter(
                id => id.toString() !== userId
            );
        } else {
            // Add dislike
            solution.dislikes.push(userId);

            // Remove existing like
            solution.likes = solution.likes.filter(
                id => id.toString() !== userId
            );
        }

        await solution.save();

        res.status(200).json(solution);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error",
        });
    }
});

module.exports = router;