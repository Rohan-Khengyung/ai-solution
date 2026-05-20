import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogPostBySlug } from '../services/api';

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

  if (loading) return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-12 text-center text-red-600">{error}</div>;
  if (!post) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-6 flex justify-between">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span>By {post.author}</span>
      </div>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-6">{post.content}</p>
        {/* If content is HTML, use dangerouslySetInnerHTML */}
      </div>
    </div>
  );
};

export default BlogPost;