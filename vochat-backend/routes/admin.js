// routes/admin.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

// GET /api/admin/users – fetch all registered users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/admin/voices – list uploaded voice files
router.get('/voices', (req, res) => {
  const uploadPath = path.join(__dirname, '..', 'uploads');
  fs.readdir(uploadPath, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read uploads folder' });
    res.json(files);
  });
});

module.exports = router;
