const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET recent messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(200);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
