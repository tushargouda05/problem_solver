const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});