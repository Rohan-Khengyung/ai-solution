import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import { getBlogPosts } from '../services/api';
import { MOCK_POSTS } from '../data/mockBlogData';

// Derive categories from mock and API posts
const DEFAULT_CATEGORIES = ['All', 'AI Insights', 'Case Studies', 'Best Practices', 'Company News'];

const CATEGORY_COLORS = {
  'AI Insights': '#6366f1',
  'Case Studies': '#06b6d4',
  'Best Practices': '#10b981',
  'Company News': '#f59e0b',
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getBlogPosts(1);
        if (res.data && res.data.data && res.data.data.length > 0) {
          setPosts(res.data.data);
        } else {
          // No data from API, use mock
          setPosts(MOCK_POSTS);
        }
      } catch (err) {
        console.error('API error, using mock data:', err);
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Extract unique categories from posts (fallback to DEFAULT_CATEGORIES)
  const availableCategories = posts.length
    ? ['All', ...new Set(posts.map(p => p.category || (p.tags && p.tags[0]) || 'Uncategorized').filter(Boolean))]
    : DEFAULT_CATEGORIES;

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => (p.category || (p.tags && p.tags[0])) === activeCategory);

  const [featured, ...rest] = filtered;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ background: '#030712', paddingTop: '80px' }}>
      {/* Hero Section (same as before) */}
      <section style={{
        padding: '80px 24px 60px',
        background: 'linear-gradient(180deg, #060f24 0%, #030712 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            marginBottom: '24px',
          }}>
            <BookOpen size={14} color="#22d3ee" />
            <span style={{ color: '#22d3ee', fontSize: '0.85rem', fontWeight: 500 }}>Blog & Insights</span>
          </div>
          <h1 style={{ 
            color: '#f1f5f9', 
            marginBottom: '20px',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',  // Much larger, responsive
            fontWeight: 'bold',
            lineHeight: 1.2,
            letterSpacing: '-0.02em' }}>
            Latest from{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AI-Solutions
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Expert insights, case studies, and thought leadership from our team of AI engineers and strategists.
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section style={{ padding: '32px 24px', borderBottom: '1px solid rgba(99, 102, 241, 0.08)' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 20px', borderRadius: '999px', cursor: 'pointer',
                fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s ease',
                background: activeCategory === cat ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'rgba(255,255,255,0.04)',
                border: activeCategory === cat ? 'none' : '1px solid rgba(99, 102, 241, 0.2)',
                color: activeCategory === cat ? 'white' : '#94a3b8',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section style={{ padding: '60px 24px 120px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#475569' }}>
              No articles in this category yet.
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                    gap: '0',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                    marginBottom: '48px',
                    background: 'rgba(10, 18, 42, 0.7)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={featured.image}
                      alt={featured.title}
                      style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(270deg, rgba(3, 7, 18, 0.6) 0%, transparent 100%)',
                    }} />
                    <span style={{
                      position: 'absolute', top: '20px', left: '20px',
                      padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600,
                      background: `${CATEGORY_COLORS[featured.category] || '#6366f1'}20`,
                      border: `1px solid ${CATEGORY_COLORS[featured.category] || '#6366f1'}40`,
                      color: CATEGORY_COLORS[featured.category] || '#a5b4fc',
                    }}>
                      {featured.category || (featured.tags && featured.tags[0]) || 'Article'}
                    </span>
                  </div>
                  <div style={{ padding: '40px' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.83rem' }}>
                        <Calendar size={14} /> {new Date(featured.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.83rem' }}>
                        <User size={14} /> {featured.author || 'AI Solutions Team'}
                      </span>
                    </div>
                    <h2 style={{ color: '#f1f5f9', marginBottom: '16px' }}>{featured.title}</h2>
                    <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '24px', fontSize: '0.95rem' }}>
                      {featured.excerpt}
                    </p>
                    <Link
                      to={`/blog/${featured.slug}`}
                      style={{
                        padding: '12px 24px', borderRadius: '10px', cursor: 'pointer',
                        color: 'white', fontWeight: 600, fontSize: '0.9rem',
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        border: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        textDecoration: 'none',
                      }}
                    >
                      Read Full Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Grid of remaining posts */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
              }}>
                {rest.map((post, i) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: 'rgba(10, 18, 42, 0.7)',
                      border: '1px solid rgba(99, 102, 241, 0.12)',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.3s ease',
                    }}
                    whileHover={{ y: -4, borderColor: 'rgba(99, 102, 241, 0.3)' }}
                  >
                    <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <div style={{ position: 'relative' }}>
                        <img
                          src={post.image}
                          alt={post.title}
                          style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                        />
                        <span style={{
                          position: 'absolute', top: '16px', left: '16px',
                          padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                          background: `${CATEGORY_COLORS[post.category] || '#6366f1'}25`,
                          border: `1px solid ${CATEGORY_COLORS[post.category] || '#6366f1'}40`,
                          color: CATEGORY_COLORS[post.category] || '#a5b4fc',
                          backdropFilter: 'blur(8px)',
                        }}>
                          <Tag size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          {post.category || (post.tags && post.tags[0]) || 'Article'}
                        </span>
                      </div>
                      <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.78rem' }}>
                            <Calendar size={12} />
                            {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.78rem' }}>
                            <User size={12} /> {post.author?.split(' ')[0] || 'AI'}
                          </span>
                        </div>
                        <h3 style={{ color: '#f1f5f9', marginBottom: '12px' }}>{post.title}</h3>
                        <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '20px', fontSize: '0.875rem' }}>
                          {post.excerpt}
                        </p>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          color: '#6366f1', fontSize: '0.875rem', fontWeight: 600,
                        }}>
                          Read More <ChevronRight size={16} />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;