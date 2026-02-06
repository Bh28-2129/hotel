const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ ok: true, service: 'hotel-backend', time: new Date().toISOString() });
});

module.exports = { healthRouter: router };
