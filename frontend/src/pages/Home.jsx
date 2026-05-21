import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { getApprovedReviews, getBlogPosts } from '../services/api';

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, blogsRes] = await Promise.all([
          getApprovedReviews(),
          getBlogPosts(1)
        ]);
        setReviews(reviewsRes.data.data.slice(0, 2));
        setBlogs(blogsRes.data.data.slice(0, 2));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            AI Solutions for Digital Employee Experience
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Speeding up design, engineering, and innovation with cutting-edge artificial intelligence.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Request Demo →
            </button>
            <Link to="/services" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard number="70%" label="FASTER RESPONSE TIMES" />
            <StatsCard number="500+" label="CLIENTS WORLDWIDE" />
            <StatsCard number="3×" label="FASTER PROTOTYPING" />
            <StatsCard number="60%" label="PROCESS AUTOMATION" />
          </div>
        </div>
      </section>

      {/* Portfolio / Past Projects (static for now) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Past Projects Highlights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Project {i}</h3>
                <p className="text-gray-600 mb-4">AI-powered solution for enterprise clients.</p>
                <Link to="#" className="text-blue-600 hover:underline">Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Customer Feedback</h2>
            <Link to="/testimonials" className="text-blue-600">All testimonials →</Link>
          </div>
          {loading ? (
            <p>Loading reviews...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map(review => (
                <div key={review._id} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span>
                  </div>
                  <p className="text-gray-700 mb-4">"{review.comment}"</p>
                  <p className="font-semibold">- {review.name}, {review.company}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Event / Article Previews */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">AI Innovation Summit 2026</h3>
              <p className="text-gray-600 mb-4">June 15–17, 2026 · Kathmandu</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register Now →</button>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Latest Articles</h3>
              {blogs.map(blog => (
                <div key={blog._id} className="mb-4 pb-4 border-b">
                  <Link to={`/blog/${blog.slug}`} className="text-xl font-semibold text-blue-600 hover:underline">{blog.title}</Link>
                  <p className="text-gray-600 text-sm">{blog.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;