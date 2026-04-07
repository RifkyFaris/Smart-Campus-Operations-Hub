import { Link, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import NotificationPanel from './NotificationPanel';
import { LayoutDashboard } from 'lucide-react';

const navLinks = [
  { to: '/resources', label: 'Resources' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/dashboard', label: 'Dashboard' },
];

const Navbar = () => {
  const location = useLocation();

  const handleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log('Login Success:', tokenResponse);
      // In a full implementation: exchange this for a JWT from our backend
    },
    onError: () => console.log('Login Failed'),
  });

  return (
    <nav className="glass-panel" style={{
      margin: '1rem auto', maxWidth: 1200, display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '1rem 2rem', position: 'sticky', top: '1rem', zIndex: 50,
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.35rem' }}>Smart Campus Hub</h2>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {navLinks.map(link => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                color: isActive ? 'var(--brand-primary)' : 'var(--text-primary)',
                textDecoration: 'none', fontWeight: 500, fontSize: '0.92rem',
                transition: 'color 0.2s ease', position: 'relative', padding: '4px 0',
              }}
            >
              {link.label}
              {isActive && (
                <span style={{
                  position: 'absolute', bottom: -2, left: 0, right: 0, height: 2,
                  background: 'var(--brand-primary)', borderRadius: 2,
                }} />
              )}
            </Link>
          );
        })}

        <NotificationPanel />

        <button className="btn btn-primary" onClick={() => handleLogin()} style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
          Login with Google
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
