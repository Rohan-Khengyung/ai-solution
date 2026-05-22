import { useState, useEffect } from 'react';
import { Star, CheckCircle, PenLine, X } from 'lucide-react';
import { getApprovedReviews, submitReview } from '../services/api';

const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              n <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 fill-gray-100'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', rating: 5, comment: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

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

  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0';

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Required';
    if (!form.company.trim()) newErrors.company = 'Required';
    if (!form.comment.trim()) newErrors.comment = 'Required';
    if (form.rating < 1) newErrors.rating = 'Please select a rating';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError(null);
    try {
      await submitReview({
        name: form.name,
        company: form.company,
        rating: form.rating,
        comment: form.comment,
      });
      setSubmitted(true);
      setForm({ name: '', company: '', rating: 5, comment: '' });
      fetchReviews(); // refresh to show newly approved reviews (when approved)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Submission failed. Please try again.');
    }
  };

  const field = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const closeForm = () => {
    setFormOpen(false);
    setSubmitted(false);
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Client Stories</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Customer Testimonials</h1>
          <p className="text-lg text-gray-500">See what our clients say about working with AI Solutions.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 sm:col-span-2">
            <div className="text-center sm:text-left">
              <div className="text-4xl font-bold text-white mb-1">{averageRating}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200">Average Rating</div>
              <div className="flex justify-center sm:justify-start mt-2 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-blue-400/50" />
            <div className="text-center sm:text-left">
              <div className="text-4xl font-bold text-white mb-1">{totalReviews}+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200">Verified Reviews</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-gray-900 mb-1">98%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Satisfaction Rate</div>
          </div>

          <div className="border border-gray-200 bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Global Clients</div>
          </div>
        </div>

        {/* Testimonials Grid - Only dynamic data */}
        {loading ? (
          <div className="text-center py-12">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {reviews.map((review) => (
              <div key={review._id} className="border border-gray-200 bg-white p-6 rounded-lg relative hover:shadow-lg transition-all duration-200 group">
                <span className="absolute top-4 right-6 text-7xl text-gray-100 font-serif leading-none select-none pointer-events-none group-hover:text-gray-200 transition-colors">
                  "
                </span>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-100'}`} />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 relative z-10">"{review.comment}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-bold text-blue-600 flex-shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.company}</p>
                  </div>
                  <span className="ml-auto text-xs font-medium border border-gray-200 px-2 py-1 text-gray-500 flex items-center gap-1 rounded-full">
                    <CheckCircle className="w-3 h-3 text-emerald-500" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write a Review Section */}
        <div className="border border-gray-200 bg-white rounded-lg overflow-hidden">
          <div
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => {
              setFormOpen(!formOpen);
              setSubmitted(false);
              setErrors({});
              setSubmitError(null);
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <PenLine className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Share Your Experience</h3>
                <p className="text-sm text-gray-500 mt-0.5">Have you worked with AI Solutions? Leave a review — it helps others!</p>
              </div>
            </div>
            <div className={`w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center transition-transform ${formOpen ? 'rotate-45' : ''}`}>
              {formOpen ? <X className="w-4 h-4 text-gray-500" /> : <span className="text-gray-500 text-xl leading-none">+</span>}
            </div>
          </div>

          {formOpen && (
            <div className="border-t border-gray-200 p-6">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Review Submitted!</h4>
                  <p className="text-gray-500 mb-6">Thank you for your feedback. Our team will review and publish it shortly.</p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormOpen(false);
                    }}
                    className="text-sm font-medium text-blue-600 border border-blue-600 px-5 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {submitError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                      {submitError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Full Name <span className="text-blue-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => field('name', e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full px-4 py-3 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                      />
                      {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Company <span className="text-blue-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => field('company', e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full px-4 py-3 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                      />
                      {errors.company && <p className="mt-1 text-xs text-rose-500">{errors.company}</p>}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Your Rating <span className="text-blue-600">*</span>
                    </label>
                    <StarPicker value={form.rating} onChange={(n) => field('rating', n)} />
                    {errors.rating && <p className="mt-1 text-xs text-rose-500">{errors.rating}</p>}
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Your Review <span className="text-blue-600">*</span>
                    </label>
                    <textarea
                      value={form.comment}
                      onChange={(e) => field('comment', e.target.value)}
                      rows={4}
                      placeholder="Share your experience with AI Solutions..."
                      className="w-full px-4 py-3 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition-colors resize-none"
                    />
                    {errors.comment && <p className="mt-1 text-xs text-rose-500">{errors.comment}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-gray-100">
                    <p className="text-xs text-gray-400">Reviews are moderated and published within 1–2 business days.</p>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-7 py-3 text-sm font-bold rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Submit Review →
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;