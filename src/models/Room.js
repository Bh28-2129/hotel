const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true, enum: ['single', 'double', 'deluxe', 'suite'], index: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    image: { type: String, required: true },

    pricePerNight: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

RoomSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret.roomId;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = { Room };
