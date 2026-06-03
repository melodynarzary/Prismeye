const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../db/user');

router.get('/setup-required', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ setupRequired: count === 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/setup', async (req, res) => {
  try {

    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Name, username and password required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, username, password: hashed });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message:  'Setup complete',
      token,
      username: user.username,
      name:     user.name,
      apiKey:   user.apiKey,
      user: {
        name:     user.name,
        username: user.username,
        apiKey:   user.apiKey,
        role:     user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      username: user.username,
      name:     user.name,
      apiKey:   user.apiKey,
      user: {
        name:     user.name,
        username: user.username,
        apiKey:   user.apiKey,
        role:     user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.json({ valid: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.userId);
    if (!user) return res.json({ valid: false });

    res.json({
      valid:    true,
      name:     user.name,
      username: user.username,
      apiKey:   user.apiKey,
    });
  } catch {
    res.json({ valid: false });
  }
});

module.exports = router;