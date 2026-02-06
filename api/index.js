const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { connectDbOnce } = require('../src/config/db');
const { seedRoomsIfMissing } = require('../src/utils/seedRooms');

const { healthRouter } = require('../src/routes/health');
const { bookingsRouter } = require('../src/routes/bookings');
const { roomsRouter } = require('../src/routes/rooms');
const { authRouter } = require('../src/routes/auth');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));

// Same-origin on Vercel, but keep permissive CORS for safety
app.use(
  cors({
    origin: true,
  })
);

app.use('/api/health', healthRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/auth', authRouter);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const message = err && err.message ? err.message : 'Server error';
  res.status(500).json({ error: message });
});

let initPromise = null;
async function init() {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDbOnce(process.env.MONGODB_URI);
      await seedRoomsIfMissing();
    })();
  }
  return initPromise;
}

module.exports = async (req, res) => {
  try {
    await init();
    return app(req, res);
  } catch (err) {
    const message = err && err.message ? String(err.message) : 'Server init failed';
    const hasMongoUri = Boolean(process.env.MONGODB_URI);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: message,
        hint: hasMongoUri
          ? 'MongoDB connection failed. In Atlas, allow Network Access for your deployment (or add 0.0.0.0/0 temporarily) and confirm the user has DB access.'
          : 'MONGODB_URI is missing on Vercel. Add it in Project Settings → Environment Variables, then redeploy.',
      })
    );
  }
};
