const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.User.create({ username, password });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ user: { id: user.id, username }, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.User.findOne({ where: { username } });
  if (!user) return res.status(404).json({ message: "User not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid password" });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ user: { id: user.id, username }, token });
});

module.exports = router;


// const token = jwt.sign(
//   { id: user.id },
//   process.env.JWT_SECRET,
//   { expiresIn: '1h' } // set sensible expiry
// );