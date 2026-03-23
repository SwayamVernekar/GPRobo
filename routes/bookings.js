const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');

// Validation rules
const bookingValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('businessName')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Business name cannot exceed 200 characters'),
  body('businessType')
    .optional()
    .isIn([
      'Restaurant',
      'Cafe',
      'Hotel',
      'Bar',
      'Fast Food',
      'Fine Dining',
      'Other',
      ''
    ]).withMessage('Invalid business type'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),
  body('numberOfBranches')
    .optional()
    .isInt({ min: 0 }).withMessage('Number of branches must be a positive number'),
  body('expectedUse')
    .optional()
    .isIn([
      'Food Service',
      'Delivery',
      'Customer Interaction',
      'Entertainment',
      'Multiple Services',
      'Other',
      ''
    ]).withMessage('Invalid expected use'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
];

// POST: Submit a new booking
router.post('/prebook', bookingValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    // Create new booking
    const booking = new Booking({
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      businessName: req.body.businessName || '',
      businessType: req.body.businessType || '',
      location: req.body.location || '',
      numberOfBranches: req.body.numberOfBranches || 1,
      expectedUse: req.body.expectedUse || '',
      message: req.body.message || ''
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Pre-booking submitted successfully',
      bookingId: booking._id
    });

  } catch (error) {
    console.error('Error submitting booking:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting booking. Please try again.'
    });
  }
});

// GET: Retrieve all bookings (for admin panel)
router.get('/bookings', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
});

// GET: Retrieve a single booking by ID
router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
});

// PUT: Update booking status
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'contacted', 'interested', 'not-interested', 'converted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status'
    });
  }
});

// DELETE: Delete a booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking'
    });
  }
});

module.exports = router;
