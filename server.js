const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { connectDb } = require('./src/config/db');
const { healthRouter } = require('./src/routes/health');
const { bookingsRouter } = require('./src/routes/bookings');
const { roomsRouter } = require('./src/routes/rooms');
const { authRouter } = require('./src/routes/auth');
const { seedRoomsIfMissing } = require('./src/utils/seedRooms');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

const allowed = String(process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowed.length ? allowed : true,
  })
);

// API routes
app.use('/api/health', healthRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/auth', authRouter);

// Serve your existing frontend (no changes needed)
app.use(express.static(path.join(__dirname)));

// Fallback to index.html
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // Avoid leaking internals in production
  const message = err && err.message ? err.message : 'Server error';
  res.status(500).json({ error: message });
});

async function start() {
  const port = Number(process.env.PORT || 3000);
  await connectDb(process.env.MONGODB_URI);

  // Ensure rooms collection exists (seed on first run)
  try {
    const result = await seedRoomsIfMissing();
    // eslint-disable-next-line no-console
    console.log(result.seeded ? `Seeded rooms: ${result.count}` : `Rooms already present: ${result.count}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Room seeding skipped:', e && e.message ? e.message : e);
  }

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
