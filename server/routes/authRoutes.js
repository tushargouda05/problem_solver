const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
router.post("/register", async (req, res) => {

    try {
        const { username, email, password } = req.body;

        
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword }); 
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

       

    } catch (err) {
        
        console.error(err); 
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
   


    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
             return res.status(400).json({ message: "Invalid credentials" }); 
            }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { 
            return res.status(400).json({ message: "Invalid credentials" }); 
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });

    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;