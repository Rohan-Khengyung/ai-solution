import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Heart, Bookmark, Share2, Clock, Tag } from 'lucide-react';
import { getBlogPostBySlug } from '../services/api';

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
        if (res.data.success && res.data.data) {
          setPost(res.data.data);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchPost();
  }, [slug]);

  const readingTime = (content) => {
    const words = content?.split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / 200));
  };

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
        <div className="text-center max-w-md bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2>
          <p className="text-gray-400 mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-5 py-2 rounded-lg">
            <ArrowLeft size={18} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#030712] pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#060f24] to-[#030712] py-16 text-center">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-slate-100 max-w-3xl mx-auto"
          >
            {post.title}
          </motion.h1>
          <div className="flex justify-center gap-6 mt-6 text-slate-400 text-sm flex-wrap">
            <span className="flex items-center gap-1"><User size={14} />{post.author}</span>
            <span className="flex items-center gap-1"><Calendar size={14} />{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Clock size={14} />{readingTime(post.content)} min read</span>
            {post.category && (
              <span className="flex items-center gap-1"><Tag size={14} />{post.category}</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-indigo-500/20 overflow-hidden">
          {post.image && (
            <img src={post.image} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
          )}
          <div className="p-6 md:p-10">
            {/* Action buttons */}
            <div className="flex justify-end gap-3 mb-8 pb-4 border-b border-indigo-500/20">
              <button onClick={() => setLiked(!liked)} className="p-2 rounded-full hover:bg-white/10 transition">
                <Heart size={20} className={liked ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
              </button>
              <button className="p-2 rounded-full hover:bg-white/10 transition"><Bookmark size={20} className="text-slate-400" /></button>
              <button className="p-2 rounded-full hover:bg-white/10 transition"><Share2 size={20} className="text-slate-400" /></button>
            </div>

            {/* Content - HTML support */}
            <div
              className="prose prose-invert prose-lg max-w-none [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_p]:text-slate-300 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:text-white [&_a]:text-indigo-400 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author box */}
            <div className="mt-12 p-6 bg-gradient-to-r from-slate-800/50 to-indigo-900/30 rounded-xl border border-indigo-500/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-white">Written by {post.author}</h4>
                  <p className="text-slate-400 text-sm">Expert in AI-driven transformation and innovation.</p>
                </div>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-10 text-center">
              <Link to="/blog" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition">
                <ArrowLeft size={16} /> Back to all articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;