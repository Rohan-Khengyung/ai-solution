import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Blog', path: '/blog' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Events', path: '/events' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          background: scrolled
            ? 'rgba(3, 7, 18, 0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(99, 102, 241, 0.15)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
            {/* Logo – matches admin page style */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                border: '2px solid rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
              }}>
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6" height="6" stroke="white" strokeWidth="1.5" />
                  <rect x="9" y="1" width="6" height="6" stroke="white" strokeWidth="1.5" />
                  <rect x="1" y="9" width="6" height="6" stroke="#0055FF" strokeWidth="1.5" />
                  <rect x="9" y="9" width="6" height="6" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.25rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                AI Solutions
              </span>
            </Link>

            {/* Desktop nav – unchanged */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden-mobile">
              {NAV_LINKS.map(link => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      color: isActive ? '#a5b4fc' : '#94a3b8',
                      background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#e2e8f0';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#94a3b8';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side – unchanged */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to="/contact"
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'white',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                className="hidden-mobile"
              >
                Contact Us
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  display: 'none',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: '#e2e8f0',
                }}
                className="show-mobile"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu – unchanged */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'rgba(3, 7, 18, 0.98)',
                borderTop: '1px solid rgba(99, 102, 241, 0.15)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: pathname === link.path ? '#a5b4fc' : '#94a3b8',
                      background: pathname === link.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  style={{
                    marginTop: '8px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'white',
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    textAlign: 'center',
                  }}
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Responsive CSS classes */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Header;