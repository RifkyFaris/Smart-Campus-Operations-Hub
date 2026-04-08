import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  BarChart3, Users, CalendarCheck, AlertTriangle, CheckCircle2,
  Clock, TrendingUp, ShieldCheck, UserCog, Wrench, XCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, tRes] = await Promise.all([api.get('/bookings'), api.get('/tickets')]);
        setAllBookings(bRes.data);
        setAllTickets(tRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingBookings = allBookings.filter(b => b.status === 'PENDING');
  const openTickets = allTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS');
  const highPriorityTickets = allTickets.filter(t => t.priority === 'HIGH' && t.status !== 'RESOLVED' && t.status !== 'CLOSED');

  const stats = [
    { label: 'Total Resources', value: '24', icon: <BarChart3 size={22} />, color: '#6366f1' },
    { label: 'Active Users', value: '156', icon: <Users size={22} />, color: '#10b981' },
    { label: 'Pending Approvals', value: String(pendingBookings.length), icon: <CalendarCheck size={22} />, color: '#f59e0b' },
    { label: 'Open Tickets', value: String(openTickets.length), icon: <AlertTriangle size={22} />, color: '#ef4444' },
  ];

  const handleBookingAction = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status?status=${status}`);
      setAllBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch {
      // Optimistic update for demo
      setAllBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    }
  };

  const handleTicketAction = async (id, status) => {
    try {
      await api.patch(`/tickets/${id}/status?status=${status}`);
      setAllTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } catch {
      setAllTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    }
  };

  const fmt = (dt) => dt ? new Date(dt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  const PRIORITY_COLORS = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };
  const STATUS_COLORS = { PENDING: '#f59e0b', APPROVED: '#10b981', REJECTED: '#ef4444', CANCELLED: '#64748b', OPEN: '#6366f1', IN_PROGRESS: '#f59e0b', RESOLVED: '#10b981', CLOSED: '#64748b' };

  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: 14, borderRadius: 14, color: '#fff' }}>
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Admin Dashboard</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Campus-wide operations, approvals, and analytics.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ background: `${s.color}22`, color: s.color, padding: 12, borderRadius: 12 }}>{s.icon}</div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Weekly Chart */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem' }}>Weekly Booking Trends</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
            {[35, 50, 42, 65, 55, 70, 38].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%', height: `${h * 2}px`,
                  background: 'linear-gradient(180deg, rgba(99,102,241,0.8), rgba(99,102,241,0.2))',
                  borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease',
                }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Distribution */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem' }}>Ticket Distribution by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'HARDWARE', count: allTickets.filter(t => t.category === 'HARDWARE').length || 3, color: '#ef4444' },
              { label: 'NETWORK', count: allTickets.filter(t => t.category === 'NETWORK').length || 2, color: '#f59e0b' },
              { label: 'FACILITIES', count: allTickets.filter(t => t.category === 'FACILITIES').length || 4, color: '#6366f1' },
              { label: 'SOFTWARE', count: allTickets.filter(t => t.category === 'SOFTWARE').length || 1, color: '#10b981' },
              { label: 'OTHER', count: allTickets.filter(t => t.category === 'OTHER').length || 1, color: '#94a3b8' },
            ].map((cat, i) => {
              const maxCount = 5;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: 90, textAlign: 'right' }}>{cat.label}</span>
                  <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(cat.count / maxCount) * 100}%`, height: '100%', background: cat.color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: cat.color, minWidth: 20 }}>{cat.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pending Booking Approvals */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserCog size={20} style={{ color: 'var(--status-warning)' }} />
          <h3 style={{ margin: 0 }}>Booking Approval Queue</h3>
          <span style={{ marginLeft: 'auto', fontSize: '0.82rem', fontWeight: 600, color: 'var(--status-warning)', background: 'rgba(245,158,11,0.15)', padding: '3px 10px', borderRadius: 20 }}>
            {pendingBookings.length} pending
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>#</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>User</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Resource</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Purpose</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>When</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px 16px' }}>{b.id}</td>
                  <td style={{ padding: '12px 16px' }}>{b.user?.name || 'User'}</td>
                  <td style={{ padding: '12px 16px' }}>{b.resource?.name || 'Resource'}</td>
                  <td style={{ padding: '12px 16px' }}>{b.purpose || '—'}</td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{fmt(b.startTime)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: STATUS_COLORS[b.status], fontWeight: 600, fontSize: '0.82rem' }}>{b.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {b.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleBookingAction(b.id, 'APPROVED')} title="Approve"
                          style={{ background: 'rgba(16,185,129,0.2)', border: 'none', color: '#10b981', cursor: 'pointer', borderRadius: 6, padding: '6px 8px', display: 'flex', alignItems: 'center' }}>
                          <CheckCircle2 size={16} />
                        </button>
                        <button onClick={() => handleBookingAction(b.id, 'REJECTED')} title="Reject"
                          style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: 6, padding: '6px 8px', display: 'flex', alignItems: 'center' }}>
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* High Priority Tickets */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Wrench size={20} style={{ color: '#ef4444' }} />
          <h3 style={{ margin: 0 }}>All Tickets — Management View</h3>
          <span style={{ marginLeft: 'auto', fontSize: '0.82rem', fontWeight: 600, color: '#ef4444', background: 'rgba(239,68,68,0.15)', padding: '3px 10px', borderRadius: 20 }}>
            {highPriorityTickets.length} high priority
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>#</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Reporter</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Priority</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTickets.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px 16px' }}>{t.id}</td>
                  <td style={{ padding: '12px 16px' }}>{t.reporter?.name || 'User'}</td>
                  <td style={{ padding: '12px 16px', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</td>
                  <td style={{ padding: '12px 16px' }}>{t.category}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: PRIORITY_COLORS[t.priority], fontWeight: 600, fontSize: '0.82rem' }}>{t.priority}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 600,
                      color: STATUS_COLORS[t.status], background: `${STATUS_COLORS[t.status]}22`,
                      padding: '3px 10px', borderRadius: 20,
                    }}>{t.status?.replace(/_/g, ' ')}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {(t.status === 'OPEN' || t.status === 'IN_PROGRESS') ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        {t.status === 'OPEN' && (
                          <button onClick={() => handleTicketAction(t.id, 'IN_PROGRESS')} title="Start Working"
                            style={{ background: 'rgba(245,158,11,0.2)', border: 'none', color: '#f59e0b', cursor: 'pointer', borderRadius: 6, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 500 }}>
                            <Clock size={14} /> Assign
                          </button>
                        )}
                        <button onClick={() => handleTicketAction(t.id, 'RESOLVED')} title="Resolve"
                          style={{ background: 'rgba(16,185,129,0.2)', border: 'none', color: '#10b981', cursor: 'pointer', borderRadius: 6, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 500 }}>
                          <CheckCircle2 size={14} /> Resolve
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
