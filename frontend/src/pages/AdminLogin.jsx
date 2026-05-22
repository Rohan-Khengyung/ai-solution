import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error: authError } = useAuth();
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

  const error = authError;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand / Info */}
      <div className="hidden lg:flex w-[45%] bg-gray-900 flex-col justify-between p-14">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" stroke="white" strokeWidth="1.5" />
                <rect x="9" y="1" width="6" height="6" stroke="white" strokeWidth="1.5" />
                <rect x="1" y="9" width="6" height="6" stroke="#0055FF" strokeWidth="1.5" />
                <rect x="9" y="9" width="6" height="6" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-white">AI Solutions</span>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Admin<br />Portal
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Secure access to manage customer enquiries, track submissions, and monitor platform activity.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              'Manage customer enquiries',
              'Search, filter and sort submissions',
              'Update enquiry statuses',
              'Bulk actions and data export',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0055FF] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-xs text-gray-600">
            © 2026 AI Solutions. All rights reserved. Authorised personnel only.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center px-8">
        <div className="w-full max-w-md -mt-[70px]">
          {/* Mobile logo (visible on small screens) */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 border-2 border-gray-900 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="0.5" y="0.5" width="5" height="5" stroke="#111827" strokeWidth="1" />
                <rect x="6.5" y="0.5" width="5" height="5" stroke="#111827" strokeWidth="1" />
                <rect x="0.5" y="6.5" width="5" height="5" stroke="#0055FF" strokeWidth="1" />
                <rect x="6.5" y="6.5" width="5" height="5" stroke="#111827" strokeWidth="1" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-widest uppercase">AI Solutions</span>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-[#0055FF] mb-3">Admin Access</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-sm text-gray-500 mb-10">Enter your credentials to access the admin panel.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-[#0055FF] transition-colors duration-150"
                />
              </div>
            </div>

            {/* Password field with toggle visibility */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-[#0055FF] transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="border border-gray-300 bg-gray-50 p-3 text-sm text-gray-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0055FF] text-white py-3.5 text-sm font-bold hover:bg-[#0044CC] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing In...' : 'Sign In to Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;