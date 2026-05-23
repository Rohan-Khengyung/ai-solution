import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Share2, Bookmark, Heart, Calendar, ChevronRight } from 'lucide-react';
import { getBlogPostBySlug } from '../services/api';
import { MOCK_POSTS } from '../data/mockBlogData';

const getTagGradient = (tag) => {
  const styles = {
    'Insights': 'from-blue-500 to-indigo-500',
    'Engineering': 'from-violet-500 to-purple-500',
    'Case Study': 'from-emerald-500 to-teal-500',
    'Product': 'from-amber-500 to-orange-500',
    'News': 'from-rose-500 to-pink-500',
    'AI': 'from-sky-500 to-cyan-500',
    'Automation': 'from-cyan-500 to-blue-500',
  };
  const key = Object.keys(styles).find(k => tag?.toLowerCase().includes(k.toLowerCase())) || 'Default';
  return styles[key] || 'from-gray-500 to-slate-500';
};

const getReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        const res = await getBlogPostBySlug(slug);
        if (res.data && res.data.data) {
          setPost(res.data.data);
        } else {
          // API returned empty -> try mock
          const mockPost = MOCK_POSTS.find(p => p.slug === slug);
          if (mockPost) setPost(mockPost);
          else setError('Post not found');
        }
      } catch (err) {
        console.error('API error, falling back to mock:', err);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-4">The article "{slug}" does not exist.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(post.content);
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        </div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/grain.svg")' }} />
        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          {post.tags?.length > 0 && (
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${getTagGradient(tag)} text-white shadow-md`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
            <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author || 'AI Solutions Team'}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{formattedDate}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{readingTime} min read</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-12 md:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white max-w-4xl mx-auto px-4 py-12 md:py-16">
        {post.image && (
          <img src={post.image} alt={post.title} className="w-full rounded-2xl shadow-2xl mb-12 -mt-8 md:-mt-12" />
        )}
        <div className="flex justify-end gap-3 mb-8 border-b pb-4">
          <button onClick={() => setLiked(!liked)} className="p-2 rounded-full hover:bg-gray-50">
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-50"><Bookmark className="w-5 h-5 text-gray-400" /></button>
          <button className="p-2 rounded-full hover:bg-gray-50"><Share2 className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="prose prose-lg prose-indigo max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-16 p-6 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {post.author?.charAt(0) || 'A'}
            </div>
            <div>
              <h4 className="font-bold">Written by {post.author || 'AI Solutions Team'}</h4>
              <p className="text-sm text-gray-500">Expert in AI-driven transformation.</p>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link to="/blog" className="inline-flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full hover:border-indigo-300 transition">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPost;