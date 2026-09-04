const express = require("express");
const Comment = require("../models/comment");
const protect = require("../middleware/authMiddleware");



const router = express.Router();
//add a comment to either a problem or solution
router.post("/:targetType/:targetId", protect, async (req, res) => {
    try {
        const { content } = req.body;
        const { targetType, targetId } = req.params;

        const comment = new Comment({
            content,
            author: req.user.id,
            targetType,
            targetId,
        });

        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

//list comments for target no protect
router.get("/:targetType/:targetId", async (req, res) => {
    try {
        const { targetId ,targetType} = req.params;
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
//edit own comment
router.put("/:id", protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to edit this comment" });
        }
        const { content, image } = req.body;
        if (content) comment.content = content;
        if (image) comment.image = image;
        await comment.save();
        res.status(200).json(comment);

    }
    catch (err) {
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