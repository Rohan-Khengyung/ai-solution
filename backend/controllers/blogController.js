const BlogPost = require('../models/BlogPost');
const slugify = require('slugify');

// Helper function to generate unique slug
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

// Public: Get published blog posts
const getPublishedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    const skip = (page - 1) * limit;
    const posts = await BlogPost.find({ published: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await BlogPost.countDocuments({ published: true });
    res.json({
      success: true,
      data: posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: Get single blog post by slug
const getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.views += 1;
    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Create new post
const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, image, author, tags, published } = req.body;

    // Validate required fields
    if (!title || !content || !excerpt) {
      return res.status(400).json({ message: 'Title, content, and excerpt are required' });
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
      published: published !== undefined ? published : true
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Admin: Update post
const updatePost = async (req, res) => {
  try {
    const { title, ...updateData } = req.body;
    if (title) {
      updateData.slug = await generateUniqueSlug(title, req.params.id);
      updateData.title = title;
    }
    const post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Admin: Delete post
const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all posts (including unpublished)
const getAllBlogsAdmin = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
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