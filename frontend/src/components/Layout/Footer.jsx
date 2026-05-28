import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: '#030712',
      borderTop: '1px solid rgba(99, 102, 241, 0.15)',
      padding: '60px 24px 32px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* Brand Column */}
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
                fontSize: '1.25rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                AI Solutions
              </span>
            </Link>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '260px' }}>
              AI-powered solutions for the modern digital enterprise. Helping 500+ businesses worldwide accelerate innovation.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {['LI', 'TW', 'YT'].map(label => (
                <a
                  key={label}
                  href="#"
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 600,
                    color: '#9ca3af', textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.color = '#a5b4fc';
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)';
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 style={{ color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '20px', textTransform: 'uppercase' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/services', label: 'Services' },
                { to: '/testimonials', label: 'Testimonials' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{
                      color: '#94a3b8',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#cbd5e1'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 style={{ color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '20px', textTransform: 'uppercase' }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/blog', label: 'Blog' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/events', label: 'Events' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{
                      color: '#94a3b8',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#cbd5e1'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '20px', textTransform: 'uppercase' }}>
              Contact
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>hello@aisolutions.com</li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>+1 (977) 555-01399</li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Kathmandu, Nepal</li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Mon–Fri · 9am–6pm PST</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(99, 102, 241, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: 0 }}>
            © {year} AI Solutions. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a
              href="#"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.75rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.75rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;