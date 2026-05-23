import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Tag, Sparkles, TrendingUp, BookOpen, ChevronRight, Calendar, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBlogPosts } from '../services/api';
import { MOCK_POSTS } from '../data/mockBlogData';

// Enhanced tag color mapping with gradients
const TAG_STYLES = {
  'Insights': 'from-blue-500 to-indigo-500 shadow-blue-200',
  'Engineering': 'from-violet-500 to-purple-500 shadow-violet-200',
  'Case Study': 'from-emerald-500 to-teal-500 shadow-emerald-200',
  'Product': 'from-amber-500 to-orange-500 shadow-amber-200',
  'News': 'from-rose-500 to-pink-500 shadow-rose-200',
  'AI': 'from-sky-500 to-cyan-500 shadow-sky-200',
  'Automation': 'from-cyan-500 to-blue-500 shadow-cyan-200',
  'Default': 'from-gray-500 to-slate-500 shadow-gray-200'
};

const getTagGradient = (tag) => {
  const key = Object.keys(TAG_STYLES).find(k => tag?.toLowerCase().includes(k.toLowerCase())) || 'Default';
  return TAG_STYLES[key];
};

// Animated counter for the hero stats
const AnimatedNumber = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 1000;
          const step = (timestamp, startTime) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
          };
          requestAnimationFrame((t) => step(t, t));
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref} className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{count}{suffix}</span>;
};

// Fixed navigation filter buttons with icons
const FILTER_TAGS = [
  { name: 'All', icon: Sparkles },
  { name: 'Insights', icon: TrendingUp },
  { name: 'Engineering', icon: BookOpen },
  { name: 'Case Study', icon: Eye }
];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');
  const [page] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getBlogPosts(page);
        if (res.data.data && res.data.data.length > 0) {
          setPosts(res.data.data);
        } else {
          setPosts(MOCK_POSTS);
        }
      } catch (err) {
        console.error('Failed to fetch blog posts, using mock data:', err);
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  const filteredPosts = activeTag === 'All'
    ? posts
    : posts.filter(post => 
        (post.tags || []).some(tag => tag.toLowerCase() === activeTag.toLowerCase())
      );
  
  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-slate-500 font-medium">Loading wisdom...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/5 to-transparent" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/grain.svg")' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold text-white/90 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Knowledge Hub
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Our Blog
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 text-3xl md:text-4xl mt-2">
                Ideas & Insights
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Deep dives, case studies, and engineering breakthroughs from the frontlines of AI innovation.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/10"
          >
            <div className="text-center">
              <AnimatedNumber value={posts.length} suffix="+" />
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-200 mt-1">Articles</div>
            </div>
            <div className="text-center">
              <AnimatedNumber value={245} suffix="k" />
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-200 mt-1">Readers</div>
            </div>
            <div className="text-center">
              <AnimatedNumber value={12} suffix="+" />
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-200 mt-1">Expert Authors</div>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-12 md:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#f8fafc" className="fill-white" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {FILTER_TAGS.map(tag => {
            const Icon = tag.icon;
            const isActive = activeTag === tag.name;
            return (
              <motion.button
                key={tag.name}
                onClick={() => setActiveTag(tag.name)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tag.name}
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredPosts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 text-slate-400"
            >
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No posts in this category yet.</p>
              <p className="text-sm mt-2">Check back soon for new insights.</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTag}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              {/* Featured Post */}
              {featured && (
                <motion.div variants={itemVariants}>
                  <Link to={`/blog/${featured.slug}`} className="group block">
                    <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      <div className="grid md:grid-cols-5 gap-0">
                        <div className="relative md:col-span-2 h-72 md:h-auto overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-blue-600/20 z-10 mix-blend-overlay" />
                          {featured.image ? (
                            <img
                              src={featured.image}
                              alt={featured.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                              <div className="relative">
                                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl rotate-12 absolute -top-6 -left-6 opacity-20" />
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl -rotate-6 absolute top-4 left-4 opacity-30" />
                                <Tag className="relative z-10 w-16 h-16 text-indigo-500" />
                              </div>
                            </div>
                          )}
                          <div className="absolute top-4 left-4 z-20">
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${getTagGradient(featured.tags?.[0])} text-white shadow-md`}>
                              {featured.tags?.[0] || 'Featured'}
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                            <span className="flex items-center gap-1"><User className="w-4 h-4" />{featured.author || 'AI Solutions Team'}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5 group-hover:text-indigo-600 transition-colors leading-tight">
                            {featured.title}
                          </h2>
                          <p className="text-slate-500 text-lg leading-relaxed mb-6 line-clamp-3">{featured.excerpt}</p>
                          <div className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-3 transition-all">
                            Read the full story <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Rest of Posts Grid */}
              {rest.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {rest.map((post) => (
                    <motion.div
                      key={post._id}
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Link to={`/blog/${post.slug}`} className="group block h-full">
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-indigo-50">
                            {post.image ? (
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center">
                                  <Tag className="w-8 h-8 text-indigo-400" />
                                </div>
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${getTagGradient(post.tags?.[0])} text-white shadow-sm`}>
                                {post.tags?.[0] || 'Article'}
                              </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>

                          <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                              <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author?.split(' ')[0] || 'AI'}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                            <div className="mt-auto pt-4 flex items-center text-indigo-600 text-sm font-semibold group-hover:gap-2 transition-all gap-1">
                              Read more <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-full px-6 py-3 shadow-sm">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="text-slate-700">Want to stay updated?</span>
            <Link to="/contact" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition shadow-md">
              Subscribe
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Blog;