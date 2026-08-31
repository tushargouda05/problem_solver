const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const protect = require("./middleware/authMiddleware"); 
app.get("/api/test-protected", protect, (req, res) => res.json({ message: "You are authenticated", user: req.user }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {

    res.send("Hello World");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});



