const ContactDetail = require('../models/ContactDetail');

// Get contact details (public)
const getContactDetails = async (req, res) => {
  try {
    let contact = await ContactDetail.findOne();
    if (!contact) {
      // Return default if none exists
      contact = {
        email: 'hello@aisolutions.com',
        phone: '+1 (800) 555-0199',
        address: '100 Market St, San Francisco, CA',
        hours: 'Mon-Fri, 9am–6pm PST'
      };
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contact details (admin)
const updateContactDetails = async (req, res) => {
  try {
    let contact = await ContactDetail.findOne();
    if (contact) {
      Object.assign(contact, req.body);
      contact.updatedAt = Date.now();
      await contact.save();
    } else {
      contact = await ContactDetail.create(req.body);
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getContactDetails, updateContactDetails };