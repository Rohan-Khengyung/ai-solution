import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Brain, Cpu, BarChart3, Shield, Zap, Globe,
  Star, ChevronRight, Play, CheckCircle, Clock, User, Tag
} from 'lucide-react';
import { getApprovedReviews, getBlogPosts } from '../services/api';

// ---------- Animated Counter (same as sample) ----------
function AnimatedCounter({ value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 2000;
        const step = (value / duration) * 16;
        const timer = setInterval(() => {
          start += step;
          if (start >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 'clamp(2.5rem, 4vw, 4rem)',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      lineHeight: 1,
    }}>
      {count}{suffix}
    </div>
  );
}

// ---------- Fade-up animation preset ----------
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: 'easeOut' },
};

// ---------- Static data for services & stats ----------
const SERVICES = [
  {
    icon: <Brain size={28} />,
    title: 'AI Virtual Assistant',
    desc: 'Intelligent conversational agents that understand context, handle complex queries, and seamlessly escalate to human agents when needed.',
    color: '#6366f1',
  },
  {
    icon: <Cpu size={28} />,
    title: 'Custom Software Dev',
    desc: 'Bespoke software solutions built with modern tech stacks, designed to scale with your business and integrate with existing systems.',
    color: '#06b6d4',
  },
  {
    icon: <Zap size={28} />,
    title: 'Rapid Prototyping',
    desc: 'From concept to working prototype in weeks, not months. Validate your ideas fast and iterate based on real user feedback.',
    color: '#10b981',
  },
  {
    icon: <BarChart3 size={28} />,
    title: 'Data Analytics',
    desc: 'Transform raw data into actionable insights with our AI-powered analytics platform. Predict trends before they happen.',
    color: '#f59e0b',
  },
  {
    icon: <Globe size={28} />,
    title: 'Digital Transformation',
    desc: 'End-to-end digital transformation consultancy and implementation, moving your business confidently into the AI era.',
    color: '#8b5cf6',
  },
  {
    icon: <Shield size={28} />,
    title: 'Cloud Integration',
    desc: 'Seamless cloud architecture design and migration services. Secure, scalable, and optimised for performance and cost.',
    color: '#ec4899',
  },
];

const STATS = [
  { value: 200, suffix: '+', label: 'Happy Clients' },
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 5, suffix: 'yrs', label: 'Industry Experience' },
  { value: 99, suffix: '%', label: 'Client Satisfaction' },
];

// ---------- Main Home Component ----------
export default function Home() {
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
        setReviews(reviewsRes.data.data.slice(0, 3)); // show 3 testimonials
        const formattedBlogs = blogsRes.data.data.map(post => ({
          id: post._id,
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          author: post.author,
          datePublished: new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          tag: post.tags?.[0] || 'Insights',
        }));
        setBlogs(formattedBlogs.slice(0, 2));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ background: '#030712' }}>
      {/* ─── HERO ─── */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '80px',
      }}>
        {/* Animated background grid and orbs */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.07,
            backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          <div style={{
            position: 'absolute', top: '15%', left: '10%',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
            animation: 'float 10s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', top: '20%', right: '5%',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
            animation: 'float-delayed 13s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', left: '30%',
            width: '600px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
            animation: 'float 16s ease-in-out infinite reverse',
          }} />
        </div>

        <div style={{
          position: 'relative', zIndex: 10,
          textAlign: 'center', maxWidth: '1000px',
          margin: '0 auto', padding: '0 24px',
        }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              marginBottom: '24px',
            }}>
              <Zap size={14} color="#6366f1" />
              <span style={{ color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 500 }}>
                AI-Powered Software Solutions
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ color: '#f1f5f9', marginBottom: '24px', fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 800, letterSpacing: '-0.02em' }}
          >
            Innovating the{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Future
            </span>
            {' '}of Digital Experience
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              color: '#64748b', fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.7,
            }}
          >
            We leverage artificial intelligence to help industries rapidly address digital challenges,
            speeding up design, engineering, and innovation for businesses worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              to="/contact"
              style={{
                padding: '14px 32px', borderRadius: '10px', textDecoration: 'none',
                color: 'white', fontWeight: 600, fontSize: '1rem',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
              }}
            >
              Get Started <ArrowRight size={18} />
            </Link>
            <Link
              to="/services"
              style={{
                padding: '14px 32px', borderRadius: '10px', textDecoration: 'none',
                color: '#e2e8f0', fontWeight: 600, fontSize: '1rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s ease',
              }}
            >
              <Play size={18} /> Explore Services
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{
              marginTop: '64px', display: 'flex', gap: '32px',
              justifyContent: 'center', flexWrap: 'wrap',
            }}
          >
            {['Enterprise Ready', 'ISO Certified', 'GDPR Compliant', '24/7 Support'].map(badge => (
              <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={15} color="#10b981" />
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{badge}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ color: '#374151', fontSize: '0.75rem', letterSpacing: '0.1em' }}>SCROLL</span>
          <div style={{
            width: '1px', height: '40px',
            background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.5), transparent)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }} />
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, #060f24 0%, #030712 100%)',
        borderTop: '1px solid rgba(99, 102, 241, 0.08)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.08)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            textAlign: 'center',
          }}>
            {STATS.map(stat => (
              <motion.div key={stat.label} {...fadeUp}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <p style={{ color: '#64748b', marginTop: '8px', fontSize: '0.95rem' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              marginBottom: '20px',
            }}>
              <span style={{ color: '#22d3ee', fontSize: '0.85rem', fontWeight: 500 }}>What We Do</span>
            </div>
            <h2 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800 }}>
              Comprehensive AI{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Services</span>
            </h2>
            <p style={{ color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7, fontSize: '1.05rem' }}>
              From intelligent automation to custom software, we provide end-to-end solutions tailored to your industry's unique challenges.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{
                  padding: '32px',
                  borderRadius: '16px',
                  background: 'rgba(10, 18, 42, 0.7)',
                  border: '1px solid rgba(99, 102, 241, 0.12)',
                  backdropFilter: 'blur(20px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{
                  y: -6,
                  boxShadow: `0 20px 60px ${service.color}22`,
                  borderColor: `${service.color}44`,
                }}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: `${service.color}15`,
                  border: `1px solid ${service.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: service.color, marginBottom: '20px',
                }}>
                  {service.icon}
                </div>
                <h3 style={{ color: '#f1f5f9', marginBottom: '12px', fontSize: '1.5rem', fontWeight: 600 }}>{service.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: '0.95rem' }}>{service.desc}</p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  marginTop: '24px', color: service.color, fontSize: '0.9rem', fontWeight: 600,
                }}>
                  Learn more <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link
              to="/services"
              style={{
                padding: '14px 32px', borderRadius: '10px', textDecoration: 'none',
                color: 'white', fontWeight: 600, fontSize: '1rem',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
            >
              View All Services <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT / PHOTO SECTION ─── */}
      <section style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #030712 0%, #060f24 100%)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '80px', alignItems: 'center',
        }}>
          <motion.div {...fadeUp}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              marginBottom: '24px',
            }}>
              <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 500 }}>About AI-Solutions</span>
            </div>
            <h2 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800 }}>
              We Build Software That{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Thinks</span>
            </h2>
            <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: '24px', fontSize: '1rem' }}>
              Founded in Sunderland, AI-Solutions has grown from a small startup into a recognised leader in AI-driven software development. We are driven by a single mission: to make artificial intelligence accessible, practical, and transformative for every business.
            </p>
            <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: '36px', fontSize: '1rem' }}>
              Our team of engineers, data scientists, and UX specialists work in tight collaboration to deliver products that don't just function — they delight. From healthcare to fintech, we have helped over 200 companies harness the power of AI.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                to="/contact"
                style={{
                  padding: '12px 28px', borderRadius: '10px', textDecoration: 'none',
                  color: 'white', fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}
              >
                Work With Us <ArrowRight size={16} />
              </Link>
              <Link
                to="/testimonials"
                style={{
                  padding: '12px 28px', borderRadius: '10px', textDecoration: 'none',
                  color: '#a5b4fc', fontWeight: 600,
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  background: 'rgba(99, 102, 241, 0.04)',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}
              >
                Our Reviews <Star size={16} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              borderRadius: '20px', overflow: 'hidden',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              position: 'relative',
            }}>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                alt="AI-Solutions team collaborating"
                style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 60%, rgba(3, 7, 18, 0.8) 100%)',
              }} />
            </div>
            <div style={{
              position: 'absolute', bottom: '-24px', left: '-24px',
              padding: '20px 24px', borderRadius: '14px',
              background: 'rgba(10, 18, 42, 0.95)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              backdropFilter: 'blur(20px)',
            }}>
              <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.5rem' }}>£12M+</div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Value delivered to clients</div>
            </div>
            <div style={{
              position: 'absolute', top: '-16px', right: '-16px',
              padding: '14px 20px', borderRadius: '12px',
              background: 'rgba(10, 18, 42, 0.95)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{ color: '#22d3ee' }}><Zap size={20} /></div>
              <div>
                <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>AI-Powered</div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Real-time processing</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS PREVIEW (from API) ─── */}
      <section style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800 }}>
              Loved by{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Industry Leaders</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
              Don't take our word for it — hear from the companies we've helped transform.
            </p>
          </motion.div>

          {loading ? (
            <div style={{ textAlign: 'center', color: '#64748b' }}>Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b' }}>No reviews yet. Be the first!</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}>
              {reviews.map((review, i) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{
                    padding: '32px',
                    borderRadius: '16px',
                    background: 'rgba(10, 18, 42, 0.7)',
                    border: '1px solid rgba(99, 102, 241, 0.12)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} size={18} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '24px', fontSize: '0.95rem', fontStyle: 'italic' }}>
                    "{review.comment}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '0.85rem',
                    }}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>{review.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{review.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div {...fadeUp} style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link
              to="/testimonials"
              style={{
                padding: '12px 28px', borderRadius: '10px', textDecoration: 'none',
                color: '#a5b4fc', fontWeight: 600,
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
            >
              Read All Testimonials <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── LATEST ARTICLES SECTION (added from your original design) ─── */}
      <section style={{ padding: '120px 24px', background: 'linear-gradient(180deg, #030712 0%, #060f24 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              marginBottom: '20px',
            }}>
              <span style={{ color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 500 }}>Knowledge</span>
            </div>
            <h2 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800 }}>
              Latest{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Articles</span>
            </h2>
          </motion.div>

          {loading ? (
            <div style={{ textAlign: 'center', color: '#64748b' }}>Loading articles...</div>
          ) : blogs.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b' }}>No articles yet. Check back soon!</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '32px',
            }}>
              {blogs.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Link to={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '32px',
                      borderRadius: '16px',
                      background: 'rgba(10, 18, 42, 0.7)',
                      border: '1px solid rgba(99, 102, 241, 0.12)',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.3s ease',
                      height: '100%',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '10px',
                          background: 'rgba(99, 102, 241, 0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#a5b4fc'
                        }}>
                          <Tag size={20} />
                        </div>
                        <span style={{
                          background: 'rgba(6, 182, 212, 0.1)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          color: '#22d3ee',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {article.tag}
                        </span>
                      </div>
                      <h3 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
                        {article.title}
                      </h3>
                      <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
                        {article.excerpt}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', fontSize: '0.8rem', color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} /> {article.author}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} /> {article.datePublished}
                        </span>
                      </div>
                      <span style={{ color: '#a5b4fc', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        Read article <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div {...fadeUp} style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link
              to="/blog"
              style={{
                padding: '12px 28px', borderRadius: '10px', textDecoration: 'none',
                color: '#a5b4fc', fontWeight: 600,
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
            >
              View All Articles <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            {...fadeUp}
            style={{
              borderRadius: '24px',
              padding: '72px 48px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: '-100px', right: '-100px',
              width: '400px', height: '400px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <h2 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, position: 'relative' }}>
              Ready to Transform Your Business with AI?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7, position: 'relative' }}>
              Let's discuss your challenges and explore how our AI solutions can drive real results for your organisation.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link
                to="/contact"
                style={{
                  padding: '14px 36px', borderRadius: '10px', textDecoration: 'none',
                  color: 'white', fontWeight: 700, fontSize: '1rem',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 0 40px rgba(99, 102, 241, 0.35)',
                }}
              >
                Start Your Project <ArrowRight size={18} />
              </Link>
              <Link
                to="/events"
                style={{
                  padding: '14px 36px', borderRadius: '10px', textDecoration: 'none',
                  color: '#e2e8f0', fontWeight: 600, fontSize: '1rem',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}
              >
                Join an Event
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global keyframes for animations (add to your global CSS or inside style tag) */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(-10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes pulse-glow {
          0% { opacity: 0.3; height: 40px; }
          50% { opacity: 1; height: 60px; }
          100% { opacity: 0.3; height: 40px; }
        }
      `}</style>
    </div>
  );
}