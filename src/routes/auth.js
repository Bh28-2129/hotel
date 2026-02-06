const express = require('express');
const { User } = require('../models/User');
const { generateBookingId } = require('../utils/id');
const { hashPassword, verifyPassword } = require('../utils/password');

const router = express.Router();

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
}

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const pw = String(password || '');

    if (!cleanName) return res.status(400).json({ error: 'Name is required' });
    if (!isEmail(cleanEmail)) return res.status(400).json({ error: 'Valid email is required' });
    if (pw.trim().length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });

    const exists = await User.exists({ email: cleanEmail });
    if (exists) return res.status(409).json({ error: 'User already exists' });

    // Reuse existing ID generator to avoid adding more utils.
    // Prefix with US- to distinguish in DB.
    let userId = `US-${String(generateBookingId()).replace(/^BK-/, '')}`;
    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const taken = await User.exists({ userId });
      if (!taken) break;
      userId = `US-${String(generateBookingId()).replace(/^BK-/, '')}`;
    }

    const user = await User.create({
      userId,
      name: cleanName,
      email: cleanEmail,
      passwordHash: hashPassword(pw),
    });

    res.status(201).json({ user: user.toJSON() });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const pw = String(password || '');

    if (!isEmail(cleanEmail)) return res.status(400).json({ error: 'Valid email is required' });
    if (!pw) return res.status(400).json({ error: 'Password is required' });

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const ok = verifyPassword(pw, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    res.json({ user: user.toJSON() });
  } catch (err) {
    next(err);
  }
});

module.exports = { authRouter: router };
