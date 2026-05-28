const Review = require('../models/Review');

// Public: Get approved reviews
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .sort({ date: -1 })
      .limit(20);
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: Submit a review (pending approval)
const submitReview = async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, status: 'pending' });
    res.status(201).json({ success: true, message: 'Review submitted for approval' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Get all reviews (with filters)
const getAllReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const reviews = await Review.find(filter).sort({ date: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Approve review
const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Admin: Reject review
const rejectReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true, runValidators: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete review
const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApprovedReviews,
  submitReview,
  getAllReviews,
  approveReview,
  rejectReview,   
  deleteReview
};