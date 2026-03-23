const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const upload = require('../config/multer');

// Validation rules
const applicationValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  body('contactNo')
    .trim()
    .notEmpty().withMessage('Contact number is required')
    .matches(/^[0-9]{10}$/).withMessage('Contact number must be 10 digits'),
  body('collegeName')
    .trim()
    .notEmpty().withMessage('College name is required')
    .isLength({ max: 200 }).withMessage('College name cannot exceed 200 characters'),
  body('yearOfPassing')
    .trim()
    .notEmpty().withMessage('Year of passing is required'),
  body('roleCategory')
    .optional()
    .isIn([
      'AI/ML Engineer',
      'Software Engineer',
      'ROS Developer',
      'Computer Vision Engineer',
      'Full-Stack Developer',
      'Mechanical Engineer',
      'Product Designer',
      'Other',
      ''
    ]).withMessage('Invalid role category'),
  body('exceptionalWork')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Exceptional work cannot exceed 1000 characters')
];

// POST: Submit a new application
router.post('/submit', upload.single('resume'), applicationValidation, async (req, res) => {
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

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }

    // Create new application
    const application = new Application({
      name: req.body.name,
      email: req.body.email,
      contactNo: req.body.contactNo,
      collegeName: req.body.collegeName,
      yearOfPassing: req.body.yearOfPassing,
      roleCategory: req.body.roleCategory || '',
      exceptionalWork: req.body.exceptionalWork || '',
      resumeFileName: req.file.originalname,
      resumeFileType: req.file.mimetype,
      resumeFileSize: req.file.size,
      resumeData: req.file.buffer
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting application. Please try again.'
    });
  }
});

// GET: Retrieve all applications (for admin panel)
router.get('/applications', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const applications = await Application.find(query)
      .select('-resumeData') // Exclude resume data for listing
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications'
    });
  }
});

// GET: Retrieve a single application by ID
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .select('-resumeData'); // Exclude resume data

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application'
    });
  }
});

// GET: Download/View resume by application ID
router.get('/applications/:id/resume', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .select('resumeFileName resumeFileType resumeData');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if view mode is requested (inline) or download mode (attachment)
    const disposition = req.query.view === 'true' ? 'inline' : 'attachment';

    res.set({
      'Content-Type': application.resumeFileType,
      'Content-Disposition': `${disposition}; filename="${application.resumeFileName}"`,
      'Content-Length': application.resumeData.length
    });

    res.send(application.resumeData);

  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading resume'
    });
  }
});

// PUT: Update application status
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-resumeData');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: application
    });

  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status'
    });
  }
});

// DELETE: Delete an application
router.delete('/applications/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting application'
    });
  }
});

module.exports = router;
