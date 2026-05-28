import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #060f24 0%, #030712 100%)',
      borderTop: '1px solid rgba(99, 102, 241, 0.12)',
      padding: '80px 24px 40px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '48px',
          marginBottom: '64px',
        }}>
          {/* Brand Column - Original Logo */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
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
                fontSize: '1.25rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #fff, #94a3b8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>AI Solutions</span>
            </Link>
            <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '24px' }}>
              Leveraging AI to transform businesses. We innovate, promote, and deliver the future of the digital employee experience.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* LinkedIn Icon */}
              <a
                href="#"
                style={{
                  width: '38px', height: '38px', borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6366f1', transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                  e.currentTarget.style.borderColor = '#6366f1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* Twitter Icon */}
              <a
                href="#"
                style={{
                  width: '38px', height: '38px', borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6366f1', transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                  e.currentTarget.style.borderColor = '#6366f1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              {/* GitHub Icon */}
              <a
                href="#"
                style={{
                  width: '38px', height: '38px', borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6366f1', transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                  e.currentTarget.style.borderColor = '#6366f1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Home', path: '/' },
                { label: 'Services', path: '/services' },
                { label: 'Blog', path: '/blog' },
                { label: 'Testimonials', path: '/testimonials' },
                { label: 'Gallery', path: '/gallery' },
                { label: 'Events', path: '/events' },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    color: '#64748b', textDecoration: 'none', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                >
                  <span style={{ opacity: 0.5 }}>→</span> {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h4 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Our Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'AI Virtual Assistant',
                'Custom Software Dev',
                'Rapid Prototyping',
                'Digital Transformation',
                'Cloud Integration',
                'Data Analytics',
              ].map(service => (
                <Link
                  key={service}
                  to="/services"
                  style={{
                    color: '#64748b', textDecoration: 'none', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                >
                  <span style={{ opacity: 0.5 }}>→</span> {service}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Contact Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#6366f1', marginTop: '2px', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>Kathmandu, Nepal</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#6366f1', marginTop: '2px', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>+1 (977) 555-01399</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#6366f1', marginTop: '2px', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <span style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>hello@aisolutions.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div style={{ marginTop: '24px' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '10px' }}>Stay updated with our newsletter</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: '#e2e8f0', fontSize: '0.85rem', outline: 'none',
                  }}
                />
                <button style={{
                  padding: '10px 16px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  border: 'none', color: 'white', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: 600,
                }}>
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
          marginBottom: '32px',
        }} />

        {/* Bottom Bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '16px',
          justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ color: '#475569', fontSize: '0.85rem' }}>
            © {year} AI Solutions. All rights reserved. Built with passion in Sunderland, UK.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
              >
                {item}
              </a>
            ))}
            <Link to="/admin" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.85rem' }}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;