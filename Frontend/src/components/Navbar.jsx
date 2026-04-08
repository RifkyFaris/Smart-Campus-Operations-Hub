import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isUser, user, logout } = useAuth();

  // Build nav links dynamically based on role
  const navLinks = [
    { to: '/resources', label: 'Resources', show: true }, // Always visible (public)
  ];

  if (isUser) {
    navLinks.push(
      { to: '/user/dashboard', label: 'My Dashboard', show: true },
      { to: '/bookings', label: 'Bookings', show: true },
      { to: '/tickets', label: 'Tickets', show: true },
    );
  }

  if (isAdmin) {
    navLinks.push(
      { to: '/admin/dashboard', label: 'Admin Panel', show: true },
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{
      margin: '1rem auto', maxWidth: 1200, display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '1rem 2rem', position: 'sticky', top: '1rem', zIndex: 50,
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.35rem' }}>Smart Campus Hub</h2>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {navLinks.filter(l => l.show).map(link => {
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

        {isAuthenticated && <NotificationPanel />}

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {user?.name}
              <span style={{
                marginLeft: 6, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
                background: isAdmin ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)',
                color: isAdmin ? '#ef4444' : '#6366f1',
                padding: '2px 8px', borderRadius: 12,
              }}>
                {user?.role}
              </span>
            </span>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login">
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
