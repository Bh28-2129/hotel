const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },

    // Stored as a salted hash (never store plain passwords)
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret.userId;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
