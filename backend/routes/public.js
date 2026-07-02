const express = require('express');
const router = express.Router();
const { submitEnquiry } = require('../controllers/enquiryController');
const { getApprovedReviews, submitReview } = require('../controllers/reviewController');
const { getPublishedPosts, getPostBySlug } = require('../controllers/blogController');
const { getGalleryItems } = require('../controllers/galleryController');
const { getContactDetails } = require('../controllers/contactController');
const { getActiveEvents, registerForEvent } = require('../controllers/eventController');
const { validate, enquiryValidation, reviewValidation } = require('../middleware/validation');
const { storeChatMessage, getChatHistoryBySession } = require('../controllers/chatController');
const { getActiveServices } = require('../controllers/serviceController');
const { getActiveTrainings } = require('../controllers/trainingController');
const { getActiveIndustries } = require('../controllers/industryController');


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

// Events (public)
router.get('/events', getActiveEvents);
router.post('/events/register', registerForEvent);

// Chat
router.post('/chat/store', storeChatMessage);
router.get('/chat/:sessionId', getChatHistoryBySession);


// Services
router.get('/services', getActiveServices);

// Trainings
router.get('/trainings', getActiveTrainings);

// Industries
router.get('/industries', getActiveIndustries);

module.exports = router;