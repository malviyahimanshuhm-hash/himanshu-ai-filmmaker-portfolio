import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMockMode, getSupabase } from '../lib/supabase';
import './AdminLoginPage.css';

interface AdminLoginPageProps {
  onLogin: () => void;
}

export const AdminLoginPage = ({ onLogin }: AdminLoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Login - Himanshu Portfolio';
  }, []);

  const handleMockLogin = () => {
    // Mock login: accept any email/password in mock mode
    if (email && password) {
      onLogin();
      navigate('/admin');
    } else {
      setError('Please enter email and password');
    }
  };

  const handleSupabaseLogin = async () => {
    try {
      const supabase = getSupabase();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        onLogin();
        navigate('/admin');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isMockMode) {
        handleMockLogin();
      } else {
        await handleSupabaseLogin();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Himanshu Portfolio Dashboard</p>
        </div>

        {isMockMode && (
          <div className="login-warning">
            <strong>MOCK MODE</strong>: Supabase not configured. Any email/password will work for demo access.
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="login-footer">
            <a href="/" className="back-link">← Back to Portfolio</a>
          </div>
        </form>
      </div>
    </div>
  );
};
