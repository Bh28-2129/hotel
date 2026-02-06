const crypto = require('crypto');

function hashPassword(password) {
  const pw = String(password || '');
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.scryptSync(pw, salt, 32);
  return `scrypt$${salt}$${key.toString('hex')}`;
}

function verifyPassword(password, passwordHash) {
  const raw = String(passwordHash || '');
  const parts = raw.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = parts[1];
  const expectedHex = parts[2];
  const actual = crypto.scryptSync(String(password || ''), salt, 32).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expectedHex, 'hex'));
  } catch {
    return false;
  }
}

module.exports = { hashPassword, verifyPassword };
