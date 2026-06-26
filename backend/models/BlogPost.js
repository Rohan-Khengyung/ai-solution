const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, required: true, maxlength: 300 },
  content: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, default: 'AI Solutions Team' },
  category: {
    type: String,
    enum: ['article', 'blog', 'case-study'],
    default: 'blog'
  },
  published: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update updatedAt – using standard function
blogPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);