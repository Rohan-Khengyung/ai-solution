import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex">
      {/* Left Panel - hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-800 to-indigo-900 text-white flex-col justify-between p-8 md:p-12 lg:p-16 overflow-y-auto">
        <div>
          {/* Logo */}
          <div className="flex items-center space-x-2 group mb-8 md:mb-12">
            <svg className="w-8 h-8 text-blue-400 transition-transform group-hover:scale-105" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4L4 10V22L16 28L28 22V10L16 4Z" stroke="currentColor" strokeWidth="1.5" fill="white"/>
              <path d="M16 16L10 13M16 16L22 13M16 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="16" cy="10" r="2" fill="currentColor"/>
              <path d="M10 19L13 22L10 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 19L19 22L22 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold text-2xl md:text-3xl text-white tracking-tight">Ando</span>
          </div>

          {/* Admin Portal heading - size reduced */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Admin<br />Portal
          </h1>
          <p className="text-blue-100 text-base md:text-lg mt-6 md:mt-8 mb-8 leading-relaxed max-w-md">
            Secure access to manage customer enquiries, track submissions, and monitor platform activity.
          </p>
          <ul className="space-y-3 md:space-y-4 text-base md:text-lg">
            <li className="flex items-start gap-2 md:gap-3">
              <span className="text-blue-300 text-xl">•</span>
              <span>Manage customer enquiries</span>
            </li>
            <li className="flex items-start gap-2 md:gap-3">
              <span className="text-blue-300 text-xl">•</span>
              <span>Search, filter and sort submissions</span>
            </li>
            <li className="flex items-start gap-2 md:gap-3">
              <span className="text-blue-300 text-xl">•</span>
              <span>Update enquiry statuses</span>
            </li>
            <li className="flex items-start gap-2 md:gap-3">
              <span className="text-blue-300 text-xl">•</span>
              <span>Bulk actions and data export</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-blue-500/30">
          <p className="text-blue-200 text-xs">
            © 2026 Ando. All rights reserved. Authorised personnel only.
          </p>
        </div>
      </div>

      {/* Right Panel - full width on mobile, half on desktop */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center overflow-y-auto p-6 sm:p-8 md:p-12 lg:p-16">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8 md:mb-10">
            <h2 className="text-blue-600 text-sm font-bold tracking-wider">ADMIN ACCESS</h2>
            {/* Sign In heading - size reduced */}
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">Sign In</h3>
            <p className="text-gray-500 text-sm md:text-base mt-3">
              Enter your credentials to access the admin panel.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 text-xs font-semibold mb-1">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                required
                autoComplete="username"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-xs font-semibold mb-1">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          {/* Subtle brand on mobile */}
          <div className="mt-8 text-center md:hidden">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4L4 10V22L16 28L28 22V10L16 4Z" stroke="currentColor" strokeWidth="1.5" fill="white"/>
                <path d="M16 16L10 13M16 16L22 13M16 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="16" cy="10" r="2" fill="currentColor"/>
                <path d="M10 19L13 22L10 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 19L19 22L22 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-gray-400 font-semibold">Ando</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;