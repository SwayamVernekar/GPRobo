const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  businessName: {
    type: String,
    trim: true,
    maxlength: [200, 'Business name cannot exceed 200 characters']
  },
  businessType: {
    type: String,
    enum: [
      'Restaurant',
      'Cafe',
      'Hotel',
      'Bar',
      'Fast Food',
      'Fine Dining',
      'Other',
      ''
    ],
    default: ''
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  numberOfBranches: {
    type: Number,
    min: [0, 'Number of branches cannot be negative'],
    default: 1
  },
  expectedUse: {
    type: String,
    enum: [
      'Food Service',
      'Delivery',
      'Customer Interaction',
      'Entertainment',
      'Multiple Services',
      'Other',
      ''
    ],
    default: ''
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'interested', 'not-interested', 'converted'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
bookingSchema.index({ email: 1 });
bookingSchema.index({ submittedAt: -1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
