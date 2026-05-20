const { body, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  };
};

// Validation rules
const enquiryValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('jobTitle').notEmpty().withMessage('Job title is required'),
  body('jobDetails').notEmpty().withMessage('Job details are required').isLength({ min: 10 })
];

const reviewValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').notEmpty().withMessage('Comment is required').isLength({ max: 500 })
];

const blogValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('image').notEmpty().withMessage('Image URL is required')
];

module.exports = { validate, enquiryValidation, reviewValidation, blogValidation };