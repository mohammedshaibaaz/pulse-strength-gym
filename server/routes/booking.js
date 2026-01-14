import express from 'express';
import { body, validationResult } from 'express-validator';
import Class from '../models/Class.js';
import Booking from '../models/Booking.js';
import { sendBookingEmail } from '../utils/email.js';

const router = express.Router();

/**
 * GET /api/classes
 * Get all available classes with booking information
 */
router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.find().sort({ day: 1, time: 1 });
    res.json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch classes'
    });
  }
});

/**
 * POST /api/book
 * Book a class
 */
router.post('/book', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('class_id').isMongoId().withMessage('Valid class ID is required'),
  body('emergency_contact').optional().trim()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { name, email, phone, class_id, emergency_contact } = req.body;

    // Check if class exists
    const classData = await Class.findById(class_id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    // Check if class is full
    if (classData.booked_count >= classData.capacity) {
      return res.status(400).json({
        success: false,
        error: 'Class is full. Please choose another class or time.'
      });
    }

    // Check if user already booked this class
    const existingBooking = await Booking.findOne({
      email: email,
      class_id: class_id,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: 'You have already booked this class.'
      });
    }

    // Create booking
    const booking = await Booking.create({
      user_name: name,
      email,
      phone,
      class_id,
      emergency_contact
    });

    // Update class booked_count
    await Class.findByIdAndUpdate(class_id, {
      $inc: { booked_count: 1 }
    });

    // Send confirmation email (async - don't wait)
    sendBookingEmail(email, name, classData);

    // Populate class data for response
    const populatedBooking = await Booking.findById(booking._id).populate('class_id');

    res.status(201).json({
      success: true,
      message: 'Class booked successfully! Check your email for confirmation.',
      data: populatedBooking
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process booking. Please try again.'
    });
  }
});

/**
 * GET /api/bookings/:email
 * Get all bookings for a specific user by email
 */
router.get('/bookings/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const bookings = await Booking.find({
      email: email.toLowerCase(),
      status: 'confirmed'
    })
      .populate('class_id')
      .sort({ booking_date: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

/**
 * DELETE /api/booking/:id
 * Cancel a booking
 */
router.delete('/booking/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    // Decrease class booked_count
    await Class.findByIdAndUpdate(booking.class_id, {
      $inc: { booked_count: -1 }
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel booking'
    });
  }
});

export default router;
