const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: 300
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/800x400?text=AI+Solutions'
    },
    category: {
      type: String,
      default: 'AI Insights',
      enum: ['AI Insights', 'Case Studies', 'Best Practices', 'Company News', 'Technology']
    },
    author: {
      type: String,
      default: 'AI Solutions Team'
    },
    published: {
      type: Boolean,
      default: true
    },
    views: {
      type: Number,
      default: 0
    },
    tags: [String]
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);