import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';
import { getBlogPostBySlug } from '../services/api';

// Reuse tag color mapping (can be imported from a shared file)
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

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getBlogPostBySlug(slug);
        setPost(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
          {error}
        </div>
        <div className="mt-6">
          <Link to="/blog" className="text-blue-600 hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0055FF] via-blue-600 to-indigo-700 py-16 md:py-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {post.tags && post.tags.length > 0 && (
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className={`inline-block text-xs font-bold px-3 py-1 border rounded-full ${getTagClass(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-blue-100">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author || 'AI Solutions Team'}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {post.image && (
          <div className="mb-10 -mt-6">
            <img src={post.image} alt={post.title} className="w-full rounded-lg shadow-md object-cover max-h-96" />
          </div>
        )}
        
        <div className="prose prose-lg prose-blue max-w-none">
          {/* Render content as HTML if it contains HTML tags, otherwise as plain text with line breaks */}
          {post.content.includes('<') ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-gray-700 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;