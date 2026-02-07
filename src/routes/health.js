const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (_req, res) => {
  const readyState = mongoose.connection ? mongoose.connection.readyState : 0;
  res.json({
    ok: true,
    service: 'hotel-backend',
    time: new Date().toISOString(),
    db: {
      connected: readyState === 1,
      readyState,
    },
  });
});

module.exports = { healthRouter: router };
