// notification/send-broadcast.js
const express = require('express');
const router = express.Router();
const db = require('../models'); // Sequelize
const sendPushNotification = require('./sendPushNotification'); // Adjust path

router.post("/", async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required" });
  }

  try {
    const allTokens = await db.Notification.findAll();

    if (!allTokens.length) {
      return res.status(404).json({ message: "No tokens found" });
    }

    for (const record of allTokens) {
      const token = record.token;
      if (token) {
        await sendPushNotification(token, title, body);
      }
    }

    res.status(200).json({ message: "Broadcast sent to all tokens" });

  } catch (error) {
    console.error("Broadcast error:", error);
    res.status(500).json({ message: "Failed to send broadcast", error: error.message });
  }
});

module.exports = router;
