const Enquiry = require('../models/Enquiry');

// @desc    Submit new enquiry
// @route   POST /api/enquiries
// @access  Public
const submitEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all enquiries (admin)
// @route   GET /api/admin/enquiries
// @access  Private
const getEnquiries = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Enquiry.countDocuments(query);

    res.json({
      success: true,
      data: enquiries,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/admin/enquiries/:id/status
// @access  Private
const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/admin/enquiries/:id
// @access  Private
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry };