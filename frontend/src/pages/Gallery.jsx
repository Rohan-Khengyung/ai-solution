import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Images } from 'lucide-react';
import { getGalleryItems } from '../services/api';

// Category colors (from sample)
const CAT_COLORS = {
  Events: '#6366f1',
  Team: '#06b6d4',
  Workshops: '#10b981',
  Office: '#f59e0b',
  Conference: '#6366f1',
  Expo: '#10b981',
  Awards: '#f59e0b',
  Networking: '#ec4899',
  Launch: '#06b6d4',
  Product: '#8b5cf6',
};

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  // Extract unique categories from fetched items
  const categories = ['All', ...new Set(items.map(item => item.category).filter(Boolean))];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getGalleryItems();
        setItems(res.data.data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

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
          width: '600px', height: '350px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.07) 0%, transparent 70%)',
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
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            marginBottom: '24px',
          }}>
            <Images size={14} color="#a78bfa" />
            <span style={{ color: '#a78bfa', fontSize: '0.85rem', fontWeight: 500 }}>Photo Gallery</span>
          </div>
          <h1 style={{ 
            color: '#f1f5f9', 
            marginBottom: '20px',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',  // Much larger, responsive
            fontWeight: 'bold',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
           }}>
            Our{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Moments
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Behind the scenes at AI-Solutions — from team workshops and product launches to our community events.
          </p>
        </motion.div>
      </section>

      {/* Filter Bar */}
      <section style={{ padding: '28px 24px', borderBottom: '1px solid rgba(99, 102, 241, 0.08)' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '7px 20px', borderRadius: '999px', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s ease',
                background: activeCategory === cat
                  ? 'linear-gradient(135deg, #6366f1, #06b6d4)'
                  : 'rgba(255,255,255,0.04)',
                border: activeCategory === cat
                  ? 'none'
                  : '1px solid rgba(99, 102, 241, 0.18)',
                color: activeCategory === cat ? 'white' : '#94a3b8',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Masonry Grid */}
      <section style={{ padding: '60px 24px 120px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 0' }}>
            No images in this category.
          </div>
        ) : (
          <div style={{
            maxWidth: '1280px', margin: '0 auto',
            columns: '3 320px',
            columnGap: '16px',
          }}>
            {filtered.map((item, i) => {
              const categoryColor = CAT_COLORS[item.category] || '#6366f1';
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  style={{
                    breakInside: 'avoid',
                    marginBottom: '16px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'block',
                  }}
                  whileHover="hover"
                  onClick={() => setLightbox(item)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      display: 'block',
                      objectFit: 'cover',
                    }}
                  />
                  {/* Hover overlay */}
                  <motion.div
                    variants={{
                      hover: { opacity: 1 },
                    }}
                    initial={{ opacity: 0 }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 30%, rgba(3, 7, 18, 0.92) 100%)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                      padding: '20px',
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '999px',
                      fontSize: '0.72rem', fontWeight: 600, marginBottom: '8px',
                      background: `${categoryColor}25`,
                      border: `1px solid ${categoryColor}40`,
                      color: '#a5b4fc',
                      width: 'fit-content',
                    }}>
                      {item.category}
                    </span>
                    <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                    <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px' }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''}
                    </div>
                    <div style={{
                      position: 'absolute', top: '16px', right: '16px',
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.8)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <ZoomIn size={16} color="white" />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(3, 7, 18, 0.95)',
              backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
            }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                position: 'relative', maxWidth: '1000px', width: '100%',
                borderRadius: '20px', overflow: 'hidden',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightbox.image}
                alt={lightbox.title}
                style={{ width: '100%', display: 'block', maxHeight: '75vh', objectFit: 'contain', background: '#0a1228' }}
              />
              <div style={{
                padding: '20px 28px',
                background: 'rgba(10, 18, 42, 0.95)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{lightbox.title}</div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    {lightbox.createdAt ? new Date(lightbox.createdAt).toLocaleDateString() : ''} · {lightbox.category}
                  </div>
                </div>
                <button
                  onClick={() => setLightbox(null)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple keyframes for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Gallery;