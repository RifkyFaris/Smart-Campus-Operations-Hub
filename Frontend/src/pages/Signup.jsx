import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import { UserPlus } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // First, fetch the user's profile from Google using the access token
        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await profileRes.json();

        // Call our backend signup endpoint (public, no auth required)
        await api.post('/auth/signup', {
          email: profile.email,
          name: profile.name,
          oauthProviderId: profile.sub,
        });

        setStatus({ type: 'success', message: 'Account created successfully! Redirecting to login…' });
        setTimeout(() => navigate('/login'), 1500);
      } catch (err) {
        const msg = err.response?.data?.message || 'Signup failed. Please try again.';
        setStatus({ type: 'error', message: msg });
      }
    },
    onError: () => setStatus({ type: 'error', message: 'Google authentication failed.' }),
  });

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 120px)', padding: '2rem',
    }}>
      <div className="glass-panel" style={{
        maxWidth: 420, width: '100%', textAlign: 'center', padding: '3rem 2.5rem',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)', width: 64, height: 64, borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
        }}>
          <UserPlus size={32} color="#fff" />
        </div>

        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem' }}>Create Account</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Register as a <strong style={{ color: '#fff' }}>Campus User</strong> using your Google account.
          You'll be able to book facilities, report incidents, and receive notifications.
        </p>

        {status && (
          <div style={{
            padding: '12px 16px', borderRadius: 8, marginBottom: '1.5rem', fontSize: '0.9rem',
            background: status.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: status.type === 'success' ? '#10b981' : '#ef4444',
          }}>
            {status.message}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={() => handleGoogleSignup()}
          style={{
            width: '100%', padding: '14px 20px', fontSize: '1rem', gap: 10,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 4px 14px rgba(16,185,129,0.39)',
          }}
        >
          <UserPlus size={20} />
          Sign up with Google
        </button>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in here
          </a>
        </p>

        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
          Note: Only standard user accounts can be created here.<br />
          Admin accounts are managed by the system administrator.
        </p>
      </div>
    </div>
  );
};

export default Signup;
