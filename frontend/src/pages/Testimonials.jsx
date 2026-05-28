import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, TrendingUp, Users, Award, Zap, Sparkles, PenLine, X, CheckCircle, ThumbsUp, Globe } from 'lucide-react';
import { getApprovedReviews, submitReview } from '../services/api';

// Star rating picker (used in the review form)
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
                : 'text-gray-600 fill-gray-800'
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

  // Fetch approved reviews from API
  const fetchReviews = async () => {
    try {
      const res = await getApprovedReviews();
      setReviews(res.data.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0';
  const satisfactionRate = totalReviews
    ? ((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100).toFixed(0)
    : '98';

  // Form validation
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
      fetchReviews(); // refresh the list (new review will appear after admin approval)
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

  // Stats data
  const stats = [
    { icon: <Star size={24} />, value: `${averageRating}/5`, label: 'Average Rating', color: '#f59e0b' },
    { icon: <Users size={24} />, value: `${totalReviews}+`, label: 'Verified Reviews', color: '#6366f1' },
    { icon: <Award size={24} />, value: `${satisfactionRate}%`, label: 'Satisfaction Rate', color: '#10b981' },
    { icon: <Globe size={24} />, value: '500+', label: 'Global Clients', color: '#06b6d4' },
  ];

  return (
    <div style={{ background: '#030712', paddingTop: '80px' }}>
      {/* Hero Section */}
      <section style={{
        padding: '80px 24px 60px',
        background: 'linear-gradient(180deg, #060f24 0%, #030712 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            marginBottom: '24px',
          }}>
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 500 }}>Client Testimonials</span>
          </div>
          <h1 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: 'clamp(3rem, 8vw, 5.5rem)',  // Much larger, responsive
            fontWeight: 'bold',
            lineHeight: 1.2,
            letterSpacing: '-0.02em', }}>
            What Our{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Clients Say
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Real results from real clients across healthcare, fintech, logistics, and more.
          </p>
        </motion.div>
      </section>

      {/* Stats Cards */}
      <section style={{
        padding: '60px 24px',
        borderBottom: '1px solid rgba(99, 102, 241, 0.08)',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '32px', textAlign: 'center',
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                padding: '28px',
                borderRadius: '14px',
                background: 'rgba(10, 18, 42, 0.7)',
                border: '1px solid rgba(99, 102, 241, 0.12)',
              }}
            >
              <div style={{ color: stat.color, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '2rem', fontWeight: 700,
                background: `linear-gradient(135deg, ${stat.color}, ${stat.color}aa)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {stat.value}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '6px' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Grid */}
      <section style={{ padding: '80px 24px 120px' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '28px',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '60px' }}>
              <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p style={{ color: '#64748b', marginTop: '16px' }}>Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '60px', color: '#64748b' }}>
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            reviews.map((review, idx) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                style={{
                  padding: '36px',
                  borderRadius: '18px',
                  background: 'rgba(10, 18, 42, 0.7)',
                  border: '1px solid rgba(99, 102, 241, 0.12)',
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{
                  y: -4,
                  borderColor: '#6366f140',
                  boxShadow: '0 20px 50px rgba(99, 102, 241, 0.15)',
                }}
              >
                {/* Quote icon */}
                <div style={{
                  position: 'absolute', top: '28px', right: '28px',
                  color: '#6366f1', opacity: 0.2,
                }}>
                  <Quote size={40} />
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '20px' }}>
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, j) => (
                    <Star key={`empty-${j}`} size={16} color="#334155" />
                  ))}
                </div>

                {/* Comment text */}
                <p style={{
                  color: '#94a3b8', lineHeight: 1.8, marginBottom: '28px',
                  fontSize: '0.95rem', fontStyle: 'italic',
                }}>
                  "{review.comment}"
                </p>

                {/* Result badge (mock – you can replace with actual data if stored) */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  color: '#a5b4fc', fontWeight: 600, marginBottom: '24px',
                }}>
                  <Zap size={12} />
                  Verified Client
                </div>

                {/* Author info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                  }}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.95rem' }}>{review.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{review.company}</div>
                  </div>
                  <div style={{
                    marginLeft: 'auto',
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#475569',
                  }}>
                    Customer
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Write a Review Section – stylish collapsible form */}
        <div style={{
          maxWidth: '800px', margin: '80px auto 0',
          borderRadius: '20px',
          background: 'rgba(10, 18, 42, 0.7)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
        }}>
          <div
            onClick={() => {
              setFormOpen(!formOpen);
              setSubmitted(false);
              setErrors({});
              setSubmitError(null);
            }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 28px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PenLine size={22} color="white" />
              </div>
              <div>
                <h3 style={{ color: '#f1f5f9', fontSize: '1.25rem', fontWeight: 600 }}>Share Your Experience</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
                  Have you worked with AI Solutions? Leave a review — it helps others!
                </p>
              </div>
            </div>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              border: `2px solid ${formOpen ? '#6366f1' : '#334155'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              {formOpen ? <X size={18} color="#6366f1" /> : <span style={{ color: '#94a3b8', fontSize: '24px', lineHeight: 1 }}>+</span>}
            </div>
          </div>

          {formOpen && (
            <div style={{ borderTop: '1px solid rgba(99, 102, 241, 0.15)', padding: '28px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <CheckCircle size={32} color="#10b981" />
                  </div>
                  <h4 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px' }}>Review Submitted!</h4>
                  <p style={{ color: '#94a3b8', marginBottom: '28px' }}>
                    Thank you for your feedback. Our team will review and publish it shortly.
                  </p>
                  <button
                    onClick={closeForm}
                    style={{
                      padding: '10px 24px', borderRadius: '30px', border: '1px solid #6366f1',
                      background: 'transparent', color: '#a5b4fc', fontWeight: 500, cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {submitError && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem',
                    }}>
                      {submitError}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>
                        FULL NAME *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => field('name', e.target.value)}
                        placeholder="Jane Smith"
                        style={{
                          width: '100%', padding: '12px 16px', borderRadius: '12px',
                          background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99, 102, 241, 0.2)',
                          color: '#e2e8f0', outline: 'none', transition: 'border 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)'}
                      />
                      {errors.name && <p style={{ color: '#f87171', fontSize: '0.7rem', marginTop: '4px' }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>
                        COMPANY *
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => field('company', e.target.value)}
                        placeholder="Acme Corp"
                        style={{
                          width: '100%', padding: '12px 16px', borderRadius: '12px',
                          background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99, 102, 241, 0.2)',
                          color: '#e2e8f0', outline: 'none',
                        }}
                      />
                      {errors.company && <p style={{ color: '#f87171', fontSize: '0.7rem', marginTop: '4px' }}>{errors.company}</p>}
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>
                      YOUR RATING *
                    </label>
                    <StarPicker value={form.rating} onChange={(n) => field('rating', n)} />
                    {errors.rating && <p style={{ color: '#f87171', fontSize: '0.7rem', marginTop: '4px' }}>{errors.rating}</p>}
                  </div>

                  <div style={{ marginBottom: '28px' }}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>
                      YOUR REVIEW *
                    </label>
                    <textarea
                      rows={4}
                      value={form.comment}
                      onChange={(e) => field('comment', e.target.value)}
                      placeholder="Share your experience with AI Solutions..."
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '12px',
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99, 102, 241, 0.2)',
                        color: '#e2e8f0', outline: 'none', resize: 'vertical',
                      }}
                    />
                    {errors.comment && <p style={{ color: '#f87171', fontSize: '0.7rem', marginTop: '4px' }}>{errors.comment}</p>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', alignItems: 'center', borderTop: '1px solid rgba(99, 102, 241, 0.15)', paddingTop: '24px' }}>
                    <p style={{ color: '#475569', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={12} /> Reviews are moderated and published within 1–2 days.
                    </p>
                    <button
                      type="submit"
                      style={{
                        padding: '10px 28px', borderRadius: '30px',
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Testimonials;