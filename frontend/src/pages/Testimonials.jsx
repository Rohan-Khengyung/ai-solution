import { useState, useEffect } from 'react';
import { Star, CheckCircle, PenLine, X, Sparkles, Users, Globe, ThumbsUp } from 'lucide-react';
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
            className={`w-7 h-7 transition-all duration-200 ${
              n <= (hover || value)
                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                : 'text-gray-200 fill-gray-100'
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
      {/* Hero Section – vibrant gradient with animated blobs */}
      <div className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/70">
        <div className="absolute top-0 -left-48 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Client Stories</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Customer <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Testimonials</span>
          </h1>
          <p className="text-lg text-gray-600">See what our clients say about working with AI Solutions.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Stats Cards – redesigned with gradients and icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Average Rating Card – vibrant gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="flex items-start justify-between">
              <div>
                <div className="text-5xl font-black text-white mb-1">{averageRating}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-200">Average Rating</div>
              </div>
              <ThumbsUp className="w-8 h-8 text-white/30 group-hover:text-white/50 transition-colors" />
            </div>
            <div className="flex gap-0.5 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          {/* Verified Reviews Card */}
          <div className="relative overflow-hidden border border-indigo-100 bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl font-black text-gray-900 mb-1">{totalReviews}+</div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Verified Reviews</div>
              </div>
              <Users className="w-7 h-7 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle className="w-3 h-3" /> All verified
            </div>
          </div>

          {/* Satisfaction Rate Card */}
          <div className="relative overflow-hidden border border-indigo-100 bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl font-black text-gray-900 mb-1">98%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Satisfaction Rate</div>
              </div>
              <Sparkles className="w-7 h-7 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full w-[98%]" />
            </div>
          </div>

          {/* Global Clients Card */}
          <div className="relative overflow-hidden border border-indigo-100 bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl font-black text-gray-900 mb-1">500+</div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Global Clients</div>
              </div>
              <Globe className="w-7 h-7 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div className="mt-3 text-xs text-gray-400">Trusted worldwide</div>
          </div>
        </div>

        {/* Testimonials Grid – enhanced cards with hover effects */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="mt-3 text-gray-500">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {reviews.map((review, idx) => (
              <div
                key={review._id}
                className="group relative bg-white rounded-2xl border border-gray-100 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Decorative quote mark */}
                <div className="absolute top-6 right-8 text-7xl text-indigo-100 font-serif leading-none select-none group-hover:text-indigo-200 transition-colors">
                  "
                </div>
                {/* Rating stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 transition-all ${
                        i < review.rating
                          ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                          : 'text-gray-200 fill-gray-100'
                      }`}
                    />
                  ))}
                </div>
                {/* Comment */}
                <p className="text-gray-700 leading-relaxed mb-6 relative z-10 text-lg">
                  "{review.comment}"
                </p>
                {/* User info */}
                <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-base font-bold text-indigo-600 flex-shrink-0 shadow-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.company}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write a Review Section – upgraded form with gradient border */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-100 shadow-md">
          {/* Header – clickable with icon */}
          <div
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/50 transition-all duration-200 group"
            onClick={() => {
              setFormOpen(!formOpen);
              setSubmitted(false);
              setErrors({});
              setSubmitError(null);
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <PenLine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Share Your Experience</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Have you worked with AI Solutions? Leave a review — it helps others!
                </p>
              </div>
            </div>
            <div
              className={`w-8 h-8 border-2 border-indigo-200 rounded-full flex items-center justify-center transition-all duration-300 ${
                formOpen ? 'rotate-45 bg-indigo-50 border-indigo-400' : 'group-hover:border-indigo-400'
              }`}
            >
              {formOpen ? (
                <X className="w-4 h-4 text-indigo-600" />
              ) : (
                <span className="text-indigo-600 text-xl leading-none">+</span>
              )}
            </div>
          </div>

          {formOpen && (
            <div className="border-t border-indigo-100 p-6 bg-white/80 backdrop-blur-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h4>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Thank you for your feedback. Our team will review and publish it shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormOpen(false);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 border-2 border-indigo-200 px-6 py-2.5 rounded-full hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {submitError && (
                    <div className="mb-5 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
                      {submitError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Full Name <span className="text-indigo-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => field('name', e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full px-5 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                      />
                      {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Company <span className="text-indigo-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => field('company', e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full px-5 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                      />
                      {errors.company && <p className="mt-1 text-xs text-rose-500">{errors.company}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Your Rating <span className="text-indigo-600">*</span>
                    </label>
                    <StarPicker value={form.rating} onChange={(n) => field('rating', n)} />
                    {errors.rating && <p className="mt-1 text-xs text-rose-500">{errors.rating}</p>}
                  </div>

                  <div className="mb-8">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Your Review <span className="text-indigo-600">*</span>
                    </label>
                    <textarea
                      value={form.comment}
                      onChange={(e) => field('comment', e.target.value)}
                      rows={4}
                      placeholder="Share your experience with AI Solutions..."
                      className="w-full px-5 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                    />
                    {errors.comment && <p className="mt-1 text-xs text-rose-500">{errors.comment}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-gray-100">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Reviews are moderated and published within 1–2 business days.
                    </p>
                    <button
                      type="submit"
                      className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Submit Review
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
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