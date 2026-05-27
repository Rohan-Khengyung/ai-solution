import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/blog', label: 'Blog' },
    { path: '/testimonials', label: 'Testimonials' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/events', label: 'Events' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0055FF] to-indigo-600 flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" fill="white" fillOpacity="0.9" />
              <rect x="9" y="1" width="6" height="6" fill="white" fillOpacity="0.5" />
              <rect x="1" y="9" width="6" height="6" fill="white" fillOpacity="0.5" />
              <rect x="9" y="9" width="6" height="6" fill="white" fillOpacity="0.2" />
            </svg>
          </div>
          <span className="text-sm font-bold text-gray-900 tracking-widest uppercase">
            AI Solutions
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors duration-150 ${
                  isActive ? 'text-[#0055FF]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0055FF] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-[#0055FF]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;