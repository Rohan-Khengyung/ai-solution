import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-900">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-[#0055FF] to-indigo-600 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="0.5" y="0.5" width="5" height="5" fill="white" fillOpacity="0.9" />
                  <rect x="6.5" y="0.5" width="5" height="5" fill="white" fillOpacity="0.4" />
                  <rect x="0.5" y="6.5" width="5" height="5" fill="white" fillOpacity="0.4" />
                  <rect x="6.5" y="6.5" width="5" height="5" fill="white" fillOpacity="0.15" />
                </svg>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-white">
                AI Solutions
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              AI-powered solutions for the modern digital enterprise. Helping 500+ businesses worldwide accelerate innovation.
            </p>
            <div className="flex gap-3 mt-5">
              {['LI', 'TW', 'YT'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 hover:border-[#0055FF] hover:text-[#0055FF] transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Company</p>
            <ul className="space-y-2">
              {[
                ['/', 'Home'],
                ['/services', 'Services'],
                ['/testimonials', 'Testimonials'],
                ['/contact', 'Contact'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-xs text-gray-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Resources</p>
            <ul className="space-y-2">
              {[
                ['/blog', 'Blog'],
                ['/gallery', 'Gallery'],
                ['/events', 'Events'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-xs text-gray-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Contact</p>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>hello@aisolutions.com</li>
              <li>+1 (977) 555-01399</li>
              <li>Kathmandu</li>
              <li>Mon–Fri · 9am–6pm</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© 2026 AI Solutions. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;