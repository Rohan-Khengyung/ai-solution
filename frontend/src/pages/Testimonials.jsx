import { useState, useEffect } from 'react';
import { getApprovedReviews, submitReview } from '../services/api';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', company: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await getApprovedReviews();
      setReviews(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      await submitReview(formData);
      setSubmitMsg({ type: 'success', text: 'Review submitted! It will appear after approval.' });
      setFormData({ name: '', company: '', rating: 5, comment: '' });
      fetchReviews(); // refresh list (only approved ones show)
    } catch (err) {
      setSubmitMsg({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Customer Testimonials</h1>
      <p className="text-center text-gray-600 mb-12">See what our clients say about working with AI Solutions.</p>

      <div className="grid md:grid-cols-4 gap-6 mb-12 text-center">
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-3xl font-bold text-blue-600">{averageRating}</div>
          <div className="text-yellow-500">★★★★★</div>
          <div>AVERAGE RATING</div>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-3xl font-bold text-blue-600">{reviews.length}+</div>
          <div>VERIFIED REVIEWS</div>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-3xl font-bold text-blue-600">98%</div>
          <div>SATISFACTION RATE</div>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-3xl font-bold text-blue-600">500+</div>
          <div>GLOBAL CLIENTS</div>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading reviews...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {reviews.map(review => (
            <div key={review._id} className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="text-yellow-500 mb-2">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</div>
              <p className="text-gray-700 italic">"{review.comment}"</p>
              <p className="mt-4 font-semibold">– {review.name}, {review.company}</p>
            </div>
          ))}
        </div>
      )}

      {/* Write a review form */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Write a Review</h2>
        {submitMsg && (
          <div className={`mb-4 p-3 rounded ${submitMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submitMsg.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Company *</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating *</label>
            <select name="rating" value={formData.rating} onChange={handleChange} className="w-full border rounded px-3 py-2">
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Your Review *</label>
            <textarea name="comment" rows="4" value={formData.comment} onChange={handleChange} required className="w-full border rounded px-3 py-2"></textarea>
          </div>
          <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Testimonials;