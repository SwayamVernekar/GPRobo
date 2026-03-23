const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
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
  contactNo: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit contact number']
  },
  collegeName: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
    maxlength: [200, 'College name cannot exceed 200 characters']
  },
  yearOfPassing: {
    type: String,
    required: [true, 'Year of passing is required'],
    trim: true
  },
  roleCategory: {
    type: String,
    enum: [
      'AI/ML Engineer',
      'Software Engineer',
      'ROS Developer',
      'Computer Vision Engineer',
      'Full-Stack Developer',
      'Mechanical Engineer',
      'Product Designer',
      'Other',
      ''
    ],
    default: ''
  },
  exceptionalWork: {
    type: String,
    trim: true,
    maxlength: [1000, 'Exceptional work description cannot exceed 1000 characters']
  },
  resumeFileName: {
    type: String,
    required: [true, 'Resume file is required']
  },
  resumeFileType: {
    type: String,
    required: true
  },
  resumeFileSize: {
    type: Number,
    required: true
  },
  resumeData: {
    type: Buffer,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
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
applicationSchema.index({ email: 1 });
applicationSchema.index({ submittedAt: -1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
