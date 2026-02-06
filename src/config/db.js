const mongoose = require('mongoose');

function redactMongoUri(uri) {
  const raw = String(uri || '');
  try {
    const u = new URL(raw);
    if (u.username) u.username = '***';
    if (u.password) u.password = '***';
    return u.toString();
  } catch {
    // Best-effort redaction for non-standard parsing cases
    return raw.replace(/\/\/(.*)@/, '//***:***@');
  }
}

async function connectDb(mongoUri) {
  const uri = String(mongoUri || '').trim();
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Create a .env file (see .env.example).');
  }

  if (/[\s\r\n]/.test(uri)) {
    throw new Error('MONGODB_URI contains whitespace/newlines. Please paste it as a single line in .env.');
  }

  if (uri.includes('<') || uri.includes('>')) {
    throw new Error('MONGODB_URI still contains placeholders like <password> or <cluster>. Replace them with real values from Atlas.');
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });
  } catch (err) {
    const hint = redactMongoUri(uri);
    const msg = err && err.message ? err.message : String(err);
    throw new Error(`MongoDB connection failed (${msg}). Check Atlas username/password and URI: ${hint}`);
  }
}

async function connectDbOnce(mongoUri) {
  // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  if (mongoose.connection && mongoose.connection.readyState === 1) return;
  await connectDb(mongoUri);
}

module.exports = { connectDb, connectDbOnce };
