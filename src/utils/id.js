function generateBookingId() {
  // e.g. BK-A1B2C3
  return `BK-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

module.exports = { generateBookingId };
