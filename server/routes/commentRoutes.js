const express = require("express");
const Comment = require("../models/comment");
const Problem = require("../models/problem");
const Solution = require("../models/Solution");
const Notification = require("../models/notification");
const protect = require("../middleware/authMiddleware");
const router = express.Router();


// add a comment to either a problem or solution
router.post("/:targetType/:targetId", protect, async (req, res) => {
    try {
        const { content, parentComment } = req.body;
        const { targetType, targetId } = req.params;

        if (typeof content !== "string" || !content.trim()) {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        if (parentComment) {
            const parent = await Comment.findOne({ _id: parentComment, targetType, targetId });
            if (!parent) {
                return res.status(400).json({ message: "Parent comment not found for this post" });
            }
        }

        const comment = new Comment({
            content: content.trim(),
            author: req.user.id,
            targetType,
            targetId,
            parentComment: parentComment || null
        });

        await comment.save();
        await comment.populate("author", "username");

        let relatedProblem = null;
        let targetAuthor = null;

        if (targetType === "Problem") {
            relatedProblem = await Problem.findById(targetId).select("_id title author");
            targetAuthor = relatedProblem?.author;
        } else if (targetType === "Solution") {
            const targetSolution = await Solution.findById(targetId).select("problem author");
            targetAuthor = targetSolution?.author;
            relatedProblem = targetSolution
                ? await Problem.findById(targetSolution.problem).select("_id title")
                : null;
        }

        const recipients = new Map();
        const addRecipient = (recipientId, message) => {
            if (recipientId && recipientId.toString() !== req.user.id) {
                recipients.set(recipientId.toString(), message);
            }
        };

        addRecipient(targetAuthor, `replied to your ${targetType === "Problem" ? "post" : "solution"}: "${relatedProblem?.title || "a community post"}"`);
        if (parentComment) {
            const parent = await Comment.findById(parentComment).select("author");
            addRecipient(parent?.author, `replied to your comment on: "${relatedProblem?.title || "a community post"}"`);
        }

        if (relatedProblem && recipients.size) {
            await Notification.insertMany([...recipients.entries()].map(([recipient, message]) => ({
                recipient,
                actor: req.user.id,
                message,
                relatedProblem: relatedProblem._id
            })));
        }

        res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
//list comments for target no protect
router.get("/:targetType/:targetId", async (req, res) => {
    try {
        const { targetId, targetType } = req.params;
        const { search } = req.query;
        const filter = { targetId, targetType };

        const comments = await Comment.find(filter)
            .populate("author", "username")
            .sort({ createdAt: 1 });

        res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }

});

//dlete own comment
router.delete("/:id", protect, async (req, res) => {
    try {

        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }
        await comment.deleteOne();
        res.status(200).json({ message: "Comment deleted" });


    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;
