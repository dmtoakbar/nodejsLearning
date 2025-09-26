const express = require("express");
const router = express.Router();
const db = require("../models");

router.post("/", async (req, res) => {
  const { token } = req.body;
  try {
    const result = await db.Notification.create({ token });
    res.status(200).json({ message: 'Register successfully..' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;