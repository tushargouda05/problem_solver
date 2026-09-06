const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const solutionRoutes = require("./routes/solutionRoutes");
const commentRoutes = require("./routes/commentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/solutions", solutionRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use((err, req, res, next) => {
    console.error(err.message);

    if (err.message && err.message.includes("Invalid file type")) {
        return res.status(400).json({ message: err.message });
    }

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large. Max size is 5MB." });
    }

    res.status(500).json({ message: "Server error" });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});