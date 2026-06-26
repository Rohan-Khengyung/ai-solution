import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import { getBlogPosts } from '../services/api';

// Define filter options mapping
const CATEGORY_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'article', label: 'Articles' },
  { value: 'blog', label: 'Blogs' },
  { value: 'case-study', label: 'Case Studies' }
];

// Color mapping for each category
const CATEGORY_COLORS = {
  article: '#6366f1',   // indigo
  blog: '#06b6d4',      // cyan
  'case-study': '#10b981' // emerald
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Pass category filter to backend if not 'all'
        const params = {};
        if (activeCategory !== 'all') {
          params.category = activeCategory;
        }
        const res = await getBlogPosts(params);
        if (res.data.success && res.data.data) {
          setPosts(res.data.data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeCategory]); // Re-fetch when category changes

  // Featured post is the first one, rest in grid
  const featured = posts[0];
  const remaining = posts.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#030712] pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center py-20 px-6 bg-gradient-to-b from-[#060f24] to-[#030712]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-6">
            <BookOpen size={14} className="text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">Blog & Insights</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-5">
            Latest from{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Expert insights, case studies, and thought leadership from our team of AI engineers.
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <div className="border-b border-indigo-500/10">
        <div className="container mx-auto px-4 py-8 flex flex-wrap justify-center gap-3">
          {CATEGORY_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === value
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg'
                  : 'bg-white/5 border border-indigo-500/20 text-slate-300 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts */}
      <section className="container mx-auto px-4 py-16 pb-32">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No posts found in this category.
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-indigo-500/20 mb-12 bg-white/5 backdrop-blur-lg"
              >
                <div className="relative">
                  <img src={featured.image} alt={featured.title} className="w-full h-80 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/60 to-transparent" />
                  <span
                    className="absolute top-5 left-5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                    style={{
                      background: `${CATEGORY_COLORS[featured.category] || '#6366f1'}20`,
                      border: `1px solid ${CATEGORY_COLORS[featured.category] || '#6366f1'}40`,
                      color: CATEGORY_COLORS[featured.category] || '#a5b4fc',
                    }}
                  >
                    {featured.category === 'case-study' ? 'Case Study' : featured.category?.charAt(0).toUpperCase() + featured.category?.slice(1) || 'Article'}
                  </span>
                </div>
                <div className="p-8 md:p-10">
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Calendar size={14} />{new Date(featured.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><User size={14} />{featured.author}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">{featured.title}</h2>
                  <p className="text-slate-400 leading-relaxed mb-6">{featured.excerpt}</p>
                  <Link
                    to={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:gap-3 transition-all"
                  >
                    Read Full Article <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Grid Posts */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remaining.map((post, idx) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="group rounded-xl overflow-hidden bg-white/5 backdrop-blur-lg border border-indigo-500/10 hover:border-indigo-500/30 transition-all hover:-translate-y-1"
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="relative">
                      <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                      <span
                        className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1"
                        style={{
                          background: `${CATEGORY_COLORS[post.category] || '#6366f1'}25`,
                          border: `1px solid ${CATEGORY_COLORS[post.category] || '#6366f1'}40`,
                          color: CATEGORY_COLORS[post.category] || '#a5b4fc',
                        }}
                      >
                        <Tag size={11} />
                        {post.category === 'case-study' ? 'Case Study' : post.category?.charAt(0).toUpperCase() + post.category?.slice(1) || 'Article'}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <span className="flex items-center gap-1"><Calendar size={12} />{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><User size={12} />{post.author.split(' ')[0]}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-cyan-400 transition">{post.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-3">{post.excerpt.substring(0, 100)}...</p>
                      <div className="flex items-center gap-1 text-indigo-400 text-sm font-medium group-hover:gap-2 transition-all">
                        Read More <ChevronRight size={14} />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Blog;