import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import { LogOut, LayoutDashboard, CalendarDays, AlertTriangle, BookOpen, ShieldCheck, Home } from 'lucide-react';

const NAV_ICON = {
  '/resources':       <BookOpen size={15} />,
  '/user/dashboard':  <LayoutDashboard size={15} />,
  '/bookings':        <CalendarDays size={15} />,
  '/tickets':         <AlertTriangle size={15} />,
  '/admin/dashboard': <ShieldCheck size={15} />,
};

const Navbar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { isAuthenticated, isAdmin, isUser, user, logout } = useAuth();

  const navLinks = [
    { to: '/resources', label: 'Resources', show: true },
  ];
  if (isUser) {
    navLinks.push(
      { to: '/user/dashboard', label: 'Dashboard' },
      { to: '/bookings',       label: 'Bookings'  },
      { to: '/tickets',        label: 'Tickets'   },
    );
  }
  if (isAdmin) {
    navLinks.push({ to: '/admin/dashboard', label: 'Admin Panel' });
  }

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{
      position:        'sticky',
      top:             0,
      zIndex:          100,
      background:      'rgba(33, 37, 41, 0.9)', /* Charcoal grey */
      backdropFilter:  'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom:    '1px solid rgba(255,255,255,0.05)',
      boxShadow:       '0 2px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        maxWidth:       1600,
        margin:         '0 auto',
        padding:        '0 2rem',
        height:         60,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        gap:            '2rem',
      }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '0.5rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize:   '1.4rem',
            color:      'var(--text-primary)',
          }}>
            <Home size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
            Smart Campus Hub
          </span>
        </Link>

        {/* ── Nav Links ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
          {navLinks.map(link => {
            const isActive = location.pathname === link.to ||
                             (link.to !== '/' && location.pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{ textDecoration: 'none' }}
              >
                <span style={{
                  display:      'inline-flex',
                  alignItems:   'center',
                  gap:          '0.4rem',
                  padding:      '6px 12px',
                  borderRadius: 20,
                  fontSize:     '0.875rem',
                  fontWeight:   isActive ? 600 : 500,
                  color:        isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  background:   isActive ? 'var(--brand-light)' : 'transparent',
                  transition:   'all 0.15s ease',
                  cursor:       'pointer',
                  whiteSpace:   'nowrap',
                }}>
                  {NAV_ICON[link.to]}
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ── Right Side ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>

          {isAuthenticated && <NotificationPanel />}

          {isAuthenticated ? (
            <>
              {/* User chip */}
              <div style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '0.5rem',
                background:   'rgba(255,255,255,0.05)',
                border:       '1px solid rgba(255,255,255,0.08)',
                borderRadius: 24,
                padding:      '4px 12px 4px 8px',
              }}>
                {/* Avatar circle */}
                <div style={{
                  width:          28,
                  height:         28,
                  borderRadius:   '50%',
                  background:     'var(--brand-primary)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       '0.75rem',
                  fontWeight:     700,
                  color:          'var(--text-primary)',
                  flexShrink:     0,
                }}>
                  {user?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </span>
                <span style={{
                  fontSize:        '0.65rem',
                  fontWeight:      700,
                  textTransform:   'uppercase',
                  letterSpacing:   '0.05em',
                  background:      isAdmin ? 'rgba(217, 4, 41, 0.18)' : 'var(--brand-light)',
                  color:           isAdmin ? 'var(--status-danger)' : 'var(--accent-gold)',
                  padding:         '2px 7px',
                  borderRadius:    10,
                }}>
                  {user?.role}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  display:      'inline-flex',
                  alignItems:   'center',
                  gap:          '0.4rem',
                  padding:      '6px 12px',
                  borderRadius: 8,
                  border:       '1px solid rgba(255,255,255,0.08)',
                  background:   'transparent',
                  color:        'rgba(248,250,252,0.6)',
                  fontSize:     '0.82rem',
                  fontWeight:   500,
                  cursor:       'pointer',
                  transition:   'all 0.15s ease',
                  fontFamily:   'var(--font-family)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(248,250,252,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  display:      'inline-flex',
                  alignItems:   'center',
                  padding:      '6px 16px',
                  borderRadius: 20,
                  border:       '1px solid var(--accent-gold)',
                  background:   'transparent',
                  color:        'var(--accent-gold)',
                  fontSize:     '0.85rem',
                  fontWeight:   500,
                  cursor:       'pointer',
                  transition:   'all 0.15s ease',
                  fontFamily:   'var(--font-family)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197, 160, 89, 0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Login
                </button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  display:      'inline-flex',
                  alignItems:   'center',
                  padding:      '6px 16px',
                  borderRadius: 20,
                  border:       'none',
                  background:   'var(--brand-primary)',
                  color:        'var(--text-primary)',
                  fontSize:     '0.85rem',
                  fontWeight:   600,
                  cursor:       'pointer',
                  boxShadow:    '0 2px 10px rgba(46, 125, 115, 0.4)',
                  transition:   'all 0.15s ease',
                  fontFamily:   'var(--font-family)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(46, 125, 115, 0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(46, 125, 115, 0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
