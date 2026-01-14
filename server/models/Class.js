import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  trainer: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 60 // minutes
  },
  capacity: {
    type: Number,
    required: true,
    default: 8
  },
  booked_count: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  category: {
    type: String,
    required: true,
    enum: ['Strength', 'Conditioning', 'HIIT', 'Personal Training']
  }
}, {
  timestamps: true
});

// Virtual field for available spots
ClassSchema.virtual('available_spots').get(function() {
  return this.capacity - this.booked_count;
});

// Virtual field for is_full
ClassSchema.virtual('is_full').get(function() {
  return this.booked_count >= this.capacity;
});

// Ensure virtuals are included in JSON output
ClassSchema.set('toJSON', { virtuals: true });
ClassSchema.set('toObject', { virtuals: true });

const Class = mongoose.model('Class', ClassSchema);

export default Class;
