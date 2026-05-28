import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Heart, Bookmark, Share2 } from 'lucide-react';
import { getBlogPostBySlug } from '../services/api';
import { MOCK_POSTS } from '../data/mockBlogData';

// Helper: Convert plain text with markdown-like syntax to HTML
const formatContent = (content) => {
  if (!content) return '';
  // If content already contains HTML tags, return as-is
  if (/<[a-z][\s\S]*>/i.test(content)) return content;
  
  let html = content;
  // Headers (## Heading)
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Unordered lists: lines starting with - or •
  html = html.replace(/^[\-\•]\s+(.*)$/gm, '<li>$1</li>');
  // Wrap consecutive list items in <ul>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  // Paragraphs (double line break)
  html = html.replace(/\n\s*\n/g, '</p><p>');
  // Single line break to <br>
  html = html.replace(/\n/g, '<br/>');
  // Wrap in <p> if not already
  if (!html.startsWith('<')) html = '<p>' + html + '</p>';
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  return html;
};

const getReadingTime = (content) => {
  const plainText = content.replace(/<[^>]*>/g, '');
  const wordsPerMinute = 200;
  const wordCount = plainText.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getBlogPostBySlug(slug);
        if (res.data && res.data.data) {
          setPost(res.data.data);
        } else {
          const mockPost = MOCK_POSTS.find(p => p.slug === slug);
          if (mockPost) setPost(mockPost);
          else setError('Post not found');
        }
      } catch (err) {
        console.error('API error, using mock:', err);
        const mockPost = MOCK_POSTS.find(p => p.slug === slug);
        if (mockPost) setPost(mockPost);
        else setError('Post not found');
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
        <div className="max-w-md text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2>
          <p className="text-gray-400 mb-6">The article you're looking for doesn't exist or has been moved.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-lg">
            <ArrowLeft size={18} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(post.content);
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const categoryColor = post.tags?.[0] ? 
    ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)] : '#6366f1';
  
  // Format the content (plain text -> nice HTML)
  const formattedContent = formatContent(post.content);

  return (
    <div style={{ background: '#030712', paddingTop: '80px' }}>
      {/* Hero Section – matches blog listing */}
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
            <span style={{ color: '#22d3ee', fontSize: '0.85rem', fontWeight: 500 }}>Article</span>
          </div>
          <h1 style={{ color: '#f1f5f9', marginBottom: '20px' }}>{post.title}</h1>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', color: '#64748b', fontSize: '0.9rem' }}>
            <span className="flex items-center gap-2"><User size={16} />{post.author || 'AI Solutions Team'}</span>
            <span className="flex items-center gap-2"><Calendar size={16} />{formattedDate}</span>
            <span className="flex items-center gap-2"><Clock size={16} />{readingTime} min read</span>
          </div>
        </motion.div>
      </section>

      {/* Content Container – glassmorphic card */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div style={{
          background: 'rgba(10, 18, 42, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(99, 102, 241, 0.12)',
          overflow: 'hidden',
        }}>
          {post.image && (
            <div className="relative w-full h-80 md:h-96 overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              {post.tags && post.tags[0] && (
                <span style={{
                  position: 'absolute', top: '20px', left: '20px',
                  padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                  background: `${categoryColor}20`, border: `1px solid ${categoryColor}40`,
                  color: categoryColor, backdropFilter: 'blur(4px)',
                }}>
                  {post.tags[0]}
                </span>
              )}
            </div>
          )}
          <div className="p-6 md:p-10">
            {/* Action buttons */}
            <div className="flex justify-end gap-3 mb-8 pb-4 border-b border-gray-800">
              <button onClick={() => setLiked(!liked)} className="p-2 rounded-full hover:bg-gray-800 transition">
                <Heart size={20} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-800 transition"><Bookmark size={20} className="text-gray-400" /></button>
              <button className="p-2 rounded-full hover:bg-gray-800 transition"><Share2 size={20} className="text-gray-400" /></button>
            </div>

            {/* Blog content with automatic formatting */}
            <div className="blog-content prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: formattedContent }} />

            {/* Author box */}
            <div className="mt-16 p-6 bg-gradient-to-r from-gray-900 to-indigo-900 rounded-2xl border border-indigo-800/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {post.author?.charAt(0) || 'A'}
                </div>
                <div>
                  <h4 className="font-bold text-white">Written by {post.author || 'AI Solutions Team'}</h4>
                  <p className="text-sm text-gray-400">Expert in AI-driven transformation and innovation.</p>
                </div>
              </div>
            </div>

            {/* Back button */}
            <div className="mt-12 text-center">
              <Link to="/blog" className="inline-flex items-center gap-2 bg-transparent border border-gray-700 px-6 py-3 rounded-full text-gray-300 hover:border-indigo-500 hover:text-white transition">
                <ArrowLeft size={16} /> Back to all articles
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced prose styles for beautiful content rendering */}
      <style>{`
        .blog-content {
          color: #cbd5e1;
          line-height: 1.8;
        }
        .blog-content h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-top: 2rem;
          margin-bottom: 1rem;
          border-left: 4px solid #6366f1;
          padding-left: 1rem;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .blog-content p {
          margin-bottom: 1.25rem;
        }
        .blog-content ul, .blog-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          position: relative;
        }
        .blog-content li::marker {
          color: #6366f1;
        }
        .blog-content strong {
          color: #e2e8f0;
          font-weight: 700;
        }
        .blog-content a {
          color: #818cf8;
          text-decoration: none;
          border-bottom: 1px solid rgba(129, 140, 248, 0.3);
        }
        .blog-content a:hover {
          border-bottom-color: #818cf8;
        }
        .blog-content blockquote {
          border-left: 3px solid #6366f1;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #94a3b8;
          background: rgba(99, 102, 241, 0.05);
          padding: 0.75rem 1rem;
          border-radius: 8px;
        }
        .blog-content code {
          background: #1e293b;
          color: #f1f5f9;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.875em;
        }
        .blog-content pre {
          background: #0f172a;
          padding: 1rem;
          border-radius: 12px;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .blog-content pre code {
          background: none;
          padding: 0;
        }
        .blog-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, #334155, transparent);
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
};

export default BlogPost;