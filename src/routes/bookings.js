const express = require('express');
const { Booking } = require('../models/Booking');
const { Room } = require('../models/Room');
const { generateBookingId } = require('../utils/id');

const router = express.Router();

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
}

function digitsOnly(v) {
  return String(v || '').replace(/\D+/g, '');
}

function daysBetweenISO(checkIn, checkOut) {
  const a = new Date(String(checkIn || ''));
  const b = new Date(String(checkOut || ''));
  if (isNaN(a) || isNaN(b)) return NaN;
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

// GET /api/bookings
router.get('/', async (_req, res, next) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).limit(200);
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
});

// POST /api/bookings
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      roomId,
      roomTitle,
      checkIn,
      checkOut,
      paymentMethod,
      paymentDetails,
    } = req.body || {};

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = digitsOnly(phone);

    if (!cleanName) return res.status(400).json({ error: 'Name is required' });
    if (!isEmail(cleanEmail)) return res.status(400).json({ error: 'Valid email is required' });
    if (cleanPhone.length < 10 || cleanPhone.length > 15) return res.status(400).json({ error: 'Valid phone is required' });

    if (!roomId) return res.status(400).json({ error: 'roomId is required' });
    if (!roomTitle) return res.status(400).json({ error: 'roomTitle is required' });

    const roomExists = await Room.exists({ roomId: String(roomId) });
    if (!roomExists) return res.status(400).json({ error: 'Invalid roomId' });

    if (!checkIn || !checkOut) return res.status(400).json({ error: 'checkIn and checkOut are required' });
    const nights = daysBetweenISO(checkIn, checkOut);
    if (!Number.isFinite(nights) || nights <= 0) return res.status(400).json({ error: 'checkOut must be after checkIn' });
    if (nights > 30) return res.status(400).json({ error: 'Max 30 nights allowed' });

    const method = String(paymentMethod || '').toLowerCase();
    if (!['creditcard', 'debitcard', 'upi', 'cash'].includes(method)) {
      return res.status(400).json({ error: 'Invalid paymentMethod' });
    }

    // Backend is demo: we only store minimal method fields.
    const details = paymentDetails || {};
    const payment = {
      method,
      amount: Number(details.amount || 0) || 0,
      currency: String(details.currency || 'INR'),
      paidAt: new Date(),
    };

    if (method === 'creditcard' || method === 'debitcard') {
      const last4 = digitsOnly(details.cardNumber).slice(-4);
      if (!last4) return res.status(400).json({ error: 'Card details required' });
      payment.last4 = last4;
    }

    if (method === 'upi') {
      const upiId = String(details.upiId || '').trim();
      if (!upiId) return res.status(400).json({ error: 'UPI ID required' });
      payment.upiId = upiId;
    }

    // bookingId collision is extremely unlikely, but handle just in case.
    let bookingId = generateBookingId();
    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const exists = await Booking.exists({ bookingId });
      if (!exists) break;
      bookingId = generateBookingId();
    }

    const booking = await Booking.create({
      bookingId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      roomId: String(roomId),
      roomTitle: String(roomTitle),
      checkIn: String(checkIn),
      checkOut: String(checkOut),
      nights,
      status: 'Success',
      payment,
    });

    res.status(201).json({ booking });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/bookings/:bookingId/cancel
router.patch('/:bookingId/cancel', async (req, res, next) => {
  try {
    const bookingId = String(req.params.bookingId || '').trim();
    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { $set: { status: 'Canceled' } },
      { new: true }
    );

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bookings (dangerous; optional)
router.delete('/', async (_req, res, next) => {
  try {
    await Booking.deleteMany({});
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = { bookingsRouter: router };
