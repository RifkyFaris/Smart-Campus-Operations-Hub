import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { LogIn, Shield } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to the correct dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSuccess = async (credentialResponse) => {
    // credentialResponse.credential is the JWT id_token from Google
    await login(credentialResponse.credential);
  };

  const handleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 120px)', padding: '2rem',
    }}>
      <div className="glass-panel" style={{
        maxWidth: 420, width: '100%', textAlign: 'center', padding: '3rem 2.5rem',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', width: 64, height: 64,
          borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
        }}>
          <Shield size={32} color="#fff" />
        </div>

        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem' }}>Welcome Back</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Sign in with your Google account to access the Smart Campus Operations Hub.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </div>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 500 }}>
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
