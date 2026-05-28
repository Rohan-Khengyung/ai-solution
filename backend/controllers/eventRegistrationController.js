const EventRegistration = require('../models/EventRegistration');

// @desc    Delete a registration
// @route   DELETE /api/admin/registrations/:id
// @access  Private (Admin)
const deleteRegistration = async (req, res) => {
  try {
    const registration = await EventRegistration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.json({ success: true, message: 'Registration deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { deleteRegistration };