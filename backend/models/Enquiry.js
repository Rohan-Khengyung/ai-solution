const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  company: {
    type: String,
    required: [true, 'Company name is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required']
  },
  jobDetails: {
    type: String,
    required: [true, 'Job details are required']
  },
  status: {
    type: String,
    enum: ['new', 'processed', 'archived'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Enquiry', enquirySchema);