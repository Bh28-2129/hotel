const express = require('express');
const { Room } = require('../models/Room');

const router = express.Router();

// GET /api/rooms
router.get('/', async (req, res, next) => {
  try {
    const type = String(req.query.type || '').trim().toLowerCase();
    const q = type ? { type } : {};
    const rooms = await Room.find(q).sort({ roomId: 1 }).limit(500);
    res.json({ rooms });
  } catch (err) {
    next(err);
  }
});

module.exports = { roomsRouter: router };
