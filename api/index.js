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
  await init();
  return app(req, res);
};
