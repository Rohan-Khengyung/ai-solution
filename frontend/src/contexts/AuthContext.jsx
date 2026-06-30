import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Retrieve the token as a string – no JSON.parse needed
      const token = localStorage.getItem('adminToken');
      if (token) {
        setUser({ token });
      }
    } catch (error) {
      console.error('Error reading auth token:', error);
      // If any error occurs, clear localStorage
      localStorage.removeItem('adminToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      // Replace with your actual login API call
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
        setUser({ token: data.token });
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};