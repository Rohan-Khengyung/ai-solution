const express = require('express');
const router = express.Router();
const { submitEnquiry } = require('../controllers/enquiryController');
const { getApprovedReviews, submitReview } = require('../controllers/reviewController');
const { getPublishedPosts, getPostBySlug } = require('../controllers/blogController');
const { getGalleryItems } = require('../controllers/galleryController');
const { getContactDetails } = require('../controllers/contactController');
const { validate, enquiryValidation, reviewValidation } = require('../middleware/validation');

// Enquiries
router.post('/enquiries', validate(enquiryValidation), submitEnquiry);

// Reviews
router.get('/reviews', getApprovedReviews);
router.post('/reviews', validate(reviewValidation), submitReview);

// Blog
router.get('/blog', getPublishedPosts);
router.get('/blog/:slug', getPostBySlug);

// Gallery
router.get('/gallery', getGalleryItems);

// Contact
router.get('/contact', getContactDetails);

module.exports = router;