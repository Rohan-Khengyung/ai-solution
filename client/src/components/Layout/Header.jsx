import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="font-bold text-xl text-gray-900">AI SOLUTIONS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" className={({ isActive }) => `text-gray-700 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : ''}`}>Home</NavLink>
            <NavLink to="/services" className={({ isActive }) => `text-gray-700 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : ''}`}>Services</NavLink>
            <NavLink to="/testimonials" className={({ isActive }) => `text-gray-700 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : ''}`}>Testimonials</NavLink>
            <NavLink to="/events" className={({ isActive }) => `text-gray-700 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : ''}`}>Events</NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `text-gray-700 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : ''}`}>Gallery</NavLink>
            <NavLink to="/blog" className={({ isActive }) => `text-gray-700 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : ''}`}>Blog</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `text-gray-700 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : ''}`}>Contact</NavLink>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-md text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Services</Link>
              <Link to="/testimonials" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Testimonials</Link>
              <Link to="/events" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Events</Link>
              <Link to="/gallery" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
              <Link to="/blog" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header