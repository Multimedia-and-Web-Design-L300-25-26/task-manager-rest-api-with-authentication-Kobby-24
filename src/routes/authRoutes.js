import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  // - Validate input
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }


  // - Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  // - Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // - Save user
  User.create({ name, email, password: hashedPassword })
    .then(user => {
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).json(userWithoutPassword);
    })
    .catch(error => {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user." });
    });
  // - Return user (without password)
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  // - Find user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password." });
  }
  // - Compare password
  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password." });
  }
  // - Generate JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  // - Return token
  res.json({ token });
});

export default router;