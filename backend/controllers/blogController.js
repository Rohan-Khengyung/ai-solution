const BlogPost = require('../models/BlogPost');
const slugify = require('slugify');

// Valid category values
const VALID_CATEGORIES = ['article', 'blog', 'case-study'];

// Normalize category
const normalizeCategory = (category) => {
  if (!category) return 'blog';
  const trimmed = category.trim().toLowerCase();
  if (VALID_CATEGORIES.includes(trimmed)) return trimmed;
  // Map old values
  const map = {
    'ai insights': 'blog',
    'case studies': 'case-study',
    'best practices': 'article',
    'company news': 'blog'
  };
  return map[trimmed] || 'blog';
};

// Generate unique slug
const generateUniqueSlug = async (title, excludeId = null) => {
  let baseSlug = slugify(title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await BlogPost.findOne({ slug, _id: { $ne: excludeId } });
    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
};

// ========== PUBLIC ==========

const getPublishedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 6, category } = req.query;
    const filter = { published: true };
    if (category && category !== 'all') {
      filter.category = normalizeCategory(category);
    }
    const skip = (page - 1) * limit;
    const posts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await BlogPost.countDocuments(filter);
    res.json({
      success: true,
      data: posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('getPublishedPosts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    // Use findOneAndUpdate to increment views atomically and avoid pre-save hook
    const post = await BlogPost.findOneAndUpdate(
      { slug, published: true },
      { $inc: { views: 1 } },
      { returnDocument: 'after' } // returns the updated document
    );
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    console.error('getPostBySlug error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ========== ADMIN ==========

const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, image, author, tags, published, category } = req.body;
    if (!title || !content || !excerpt) {
      return res.status(400).json({ success: false, message: 'Title, content, and excerpt are required' });
    }
    const slug = await generateUniqueSlug(title);
    const post = await BlogPost.create({
      title,
      slug,
      content,
      excerpt,
      image: image || 'https://via.placeholder.com/800x400?text=AI+Solutions',
      author: author || 'AI Solutions Team',
      tags: tags || [],
      published: published !== undefined ? published : true,
      category: normalizeCategory(category)
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('createPost error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, category, ...otherData } = req.body;
    const updateData = { ...otherData };
    if (title) {
      updateData.slug = await generateUniqueSlug(title, req.params.id);
      updateData.title = title;
    }
    // Handle category
    if (category !== undefined) {
      updateData.category = normalizeCategory(category);
    } else {
      const existing = await BlogPost.findById(req.params.id);
      if (existing) {
        updateData.category = normalizeCategory(existing.category);
      } else {
        updateData.category = 'blog';
      }
    }
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    console.error('updatePost error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('deletePost error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllBlogsAdmin = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('getAllBlogsAdmin error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getPublishedPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getAllBlogsAdmin,
};