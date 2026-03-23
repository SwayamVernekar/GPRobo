const multer = require('multer');
const path = require('path');

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || 
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 20971520 // 20MB default
  },
  fileFilter: fileFilter
});

module.exports = upload;
