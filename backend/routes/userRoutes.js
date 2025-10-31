import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const router = express.Router();

// ✅ Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  lastLogin: Date,
  loginHistory: [Date],
});

// ✅ Create User model
const User = mongoose.model("User", userSchema);

// ✅ REGISTER route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "⚠️ User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "✅ User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "❌ Error saving user", error });
  }
});

// ✅ LOGIN route (updates MongoDB dynamically)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "❌ User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "❌ Invalid password" });

    // Update login history
    const now = new Date();
    user.lastLogin = now;
    user.loginHistory.push(now);
    await user.save();

    res.json({ message: "✅ Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "❌ Error logging in", error });
  }
});

// ✅ GET all users (for admin or testing)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1, lastLogin: 1, loginHistory: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching users", error });
  }
});

export default router;
