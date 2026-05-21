import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="font-bold text-xl text-white">AI SOLUTIONS</span>
            </div>
            <p className="text-sm">AI-powered solutions for the modern digital enterprise.</p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">COMPANY</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-blue-400 transition">About</Link></li>
              <li><Link to="/services" className="hover:text-blue-400 transition">Services</Link></li>
              <li><Link to="/testimonials" className="hover:text-blue-400 transition">Testimonials</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-semibold text-white mb-4">SOLUTIONS</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-blue-400 transition">AI Virtual Assistant</Link></li>
              <li><Link to="/services" className="hover:text-blue-400 transition">Prototyping</Link></li>
              <li><Link to="/services" className="hover:text-blue-400 transition">Automation</Link></li>
              <li><Link to="/services" className="hover:text-blue-400 transition">Analytics</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-white mb-4">CONNECT</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition">LinkedIn</a>
              <a href="#" className="hover:text-blue-400 transition">Twitter</a>
              <a href="#" className="hover:text-blue-400 transition">YouTube</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>© 2026 AI Solutions. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-blue-400">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer