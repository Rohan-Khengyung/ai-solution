const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { loginAdmin, getMe } = require('../controllers/adminAuthController');
const { getEnquiries, updateEnquiryStatus, deleteEnquiry } = require('../controllers/enquiryController');
const { getAllReviews, approveReview, deleteReview } = require('../controllers/reviewController');
const { createPost, updatePost, deletePost } = require('../controllers/blogController');
const { addGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { updateContactDetails } = require('../controllers/contactController');
const { getAllBlogsAdmin } = require('../controllers/blogController');

// Auth
router.post('/login', loginAdmin);
router.get('/me', protect, getMe);

// Enquiries
router.get('/enquiries', protect, getEnquiries);
router.put('/enquiries/:id/status', protect, updateEnquiryStatus);
router.delete('/enquiries/:id', protect, deleteEnquiry);

// Reviews
router.get('/reviews', protect, getAllReviews);
router.put('/reviews/:id/approve', protect, approveReview);
router.delete('/reviews/:id', protect, deleteReview);

// Blog
router.post('/blog', protect, createPost);
router.put('/blog/:id', protect, updatePost);
router.delete('/blog/:id', protect, deletePost);
router.get('/blog', protect, getAllBlogsAdmin);

// Gallery
router.post('/gallery', protect, addGalleryItem);
router.delete('/gallery/:id', protect, deleteGalleryItem);

// Contact
router.put('/contact', protect, updateContactDetails);

module.exports = router;