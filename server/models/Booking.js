import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  emergency_contact: {
    type: String,
    trim: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  booking_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Index for faster queries
BookingSchema.index({ email: 1, class_id: 1 });

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
