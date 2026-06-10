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
          background: scrolled ? 'rgba(3, 7, 18, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(99, 102, 241, 0.15)' : 'none',
        }}
      >
        <div className="header-container">
          <div className="header-inner">
            {/* Logo */}
            <Link to="/" className="logo-link">
              <div className="logo-box">
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6" height="6" stroke="white" strokeWidth="1.5" />
                  <rect x="9" y="1" width="6" height="6" stroke="white" strokeWidth="1.5" />
                  <rect x="1" y="9" width="6" height="6" stroke="#0055FF" strokeWidth="1.5" />
                  <rect x="9" y="9" width="6" height="6" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="logo-text">AI Solutions</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-desktop">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Contact Button */}
            <Link to="/contact" className="contact-btn desktop-only">
              Contact Us
            </Link>

            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mobile-menu"
            >
              <div className="header-container">
                <div className="mobile-nav-links">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`mobile-nav-link ${pathname === link.path ? 'active' : ''}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link to="/contact" className="mobile-contact-btn">
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <style jsx>{`
        /* Container styles */
        .header-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        /* Logo */
        .logo-link {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-box {
          width: 36px;
          height: 36px;
          border: 2px solid rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }
        .logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        /* Desktop navigation */
        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link {
          padding: 8px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s ease;
          color: #94a3b8;
          background: transparent;
        }
        .nav-link:hover {
          color: #e2e8f0;
          background: rgba(255,255,255,0.05);
        }
        .nav-link.active {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.1);
        }
        /* Desktop contact button */
        .contact-btn {
          padding: 10px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          white-space: nowrap;
          transition: opacity 0.2s;
        }
        .contact-btn:hover {
          opacity: 0.9;
        }
        /* Mobile menu button - hidden on desktop */
        .mobile-menu-btn {
          display: none;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: #e2e8f0;
        }
        /* Mobile menu styles */
        .mobile-menu {
          background: rgba(3, 7, 18, 0.98);
          border-top: 1px solid rgba(99, 102, 241, 0.15);
          overflow: hidden;
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 16px 0;
        }
        .mobile-nav-link {
          padding: 12px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          color: #94a3b8;
          background: transparent;
        }
        .mobile-nav-link.active {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.1);
        }
        .mobile-contact-btn {
          margin-top: 8px;
          padding: 12px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          text-align: center;
        }
        /* Responsive breakpoints */
        @media (max-width: 1024px) {
          .nav-desktop {
            gap: 2px;
          }
          .nav-link {
            padding: 8px 16px;
          }
        }
        @media (max-width: 900px) {
          .nav-desktop,
          .desktop-only {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .header-container {
            padding: 0 24px;
          }
          .logo-text {
            font-size: 1.1rem;
          }
          .logo-box {
            width: 32px;
            height: 32px;
          }
          .header-inner {
            height: 64px;
          }
        }
        @media (max-width: 480px) {
          .logo-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default Header;