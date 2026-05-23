import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Tag } from 'lucide-react';
import { getBlogPosts } from '../services/api';

// Tag color mapping
const TAG_COLORS = {
  'Insights': 'bg-blue-100 text-blue-700 border-blue-200',
  'Engineering': 'bg-violet-100 text-violet-700 border-violet-200',
  'Case Study': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Product': 'bg-amber-100 text-amber-700 border-amber-200',
  'News': 'bg-rose-100 text-rose-700 border-rose-200',
  'AI': 'bg-purple-100 text-purple-700 border-purple-200',
  'Automation': 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

const getTagClass = (tag) => TAG_COLORS[tag] || 'bg-gray-100 text-gray-600 border-gray-200';

// Fixed navigation filter buttons
const FILTER_TAGS = ['All', 'Insights', 'Engineering', 'Case Study'];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');
  const [page] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getBlogPosts(page);
        setPosts(res.data.data);
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  // Filter posts based on selected tag (case-insensitive match)
  const filteredPosts = activeTag === 'All'
    ? posts
    : posts.filter(post => 
        (post.tags || []).some(tag => tag.toLowerCase() === activeTag.toLowerCase())
      );
  
  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Loading articles...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-[#0055FF] via-blue-600 to-indigo-700">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">Knowledge Hub</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Blog</h1>
          <p className="text-lg text-blue-100 max-w-xl">
            Insights, case studies, and engineering deep-dives from the AI Solutions team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Fixed Navigation Buttons */}
        <div className="flex flex-wrap gap-2 mb-12">
          {FILTER_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 text-sm font-medium border transition-all duration-150 ${
                activeTag === tag
                  ? 'bg-[#0055FF] text-white border-[#0055FF]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No posts in this category yet.</div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <Link to={`/blog/${featured.slug}`} className="group block mb-12 border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden rounded-lg">
                <div className="grid md:grid-cols-2">
                  {/* Illustration / Image */}
                  <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[280px] md:min-h-[320px] flex items-center justify-center p-8">
                    {featured.image ? (
                      <img src={featured.image} alt={featured.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-[#0055FF] to-indigo-600 rounded-2xl rotate-12 opacity-20 absolute -top-4 -left-4" />
                        <div className="w-24 h-24 bg-gradient-to-br from-[#0055FF] to-blue-400 rounded-xl -rotate-6 opacity-30 absolute top-8 left-8" />
                        <div className="relative z-10 flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#0055FF] to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Tag className="w-8 h-8 text-white" />
                          </div>
                          <span className={`text-xs font-bold px-3 py-1.5 border rounded-full ${getTagClass(featured.tags?.[0] || 'General')}`}>
                            {featured.tags?.[0] || 'General'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-bold text-blue-400 border border-blue-200 px-2 py-1 bg-white/60 rounded-full">Featured</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-10 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#0055FF] transition-colors leading-tight">
                      {featured.title}
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{featured.author || 'AI Solutions Team'}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(featured.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="flex items-center gap-2 text-sm font-bold text-[#0055FF] group-hover:gap-3 transition-all">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of Posts Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(post => (
                  <Link key={post._id} to={`/blog/${post.slug}`} className="group block border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden rounded-lg flex-col">
                    {/* Card top illustration */}
                    <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                      {post.image ? (
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-gradient-to-br from-[#0055FF]/10 to-indigo-100 rounded-2xl rotate-12 absolute" />
                          <div className="w-12 h-12 bg-gradient-to-br from-[#0055FF] to-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-100 relative z-10">
                            <Tag className="w-5 h-5 text-white" />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <span className={`self-start text-xs font-bold px-2.5 py-1 border rounded-full mb-3 ${getTagClass(post.tags?.[0] || 'General')}`}>
                        {post.tags?.[0] || 'General'}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#0055FF] transition-colors leading-snug flex-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author || 'AI Solutions Team'}</span>
                        <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;