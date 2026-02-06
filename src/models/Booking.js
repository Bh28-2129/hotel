const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },

    // Customer
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },

    // Room/details
    hotel: { type: String, default: 'Azure Bay Grand Hotel' },
    roomId: { type: String, required: true },
    roomTitle: { type: String, required: true },

    // Dates
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    nights: { type: Number, required: true, min: 1, max: 30 },

    // Payment
    payment: {
      method: {
        type: String,
        required: true,
        enum: ['creditcard', 'debitcard', 'upi', 'cash'],
      },
      last4: { type: String },
      upiId: { type: String },
      amount: { type: Number, required: true },
      currency: { type: String, default: 'INR' },
      paidAt: { type: Date, default: Date.now },
    },

    status: {
      type: String,
      required: true,
      enum: ['Success', 'Canceled'],
      default: 'Success',
    },
  },
  { timestamps: true }
);

// Make API responses a bit cleaner
BookingSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret.bookingId;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = { Booking };
