import React from 'react';
import { BarChart3, Users, CalendarCheck, AlertTriangle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

// Static dashboard data — in a production app this would come from a dedicated analytics API
const stats = [
  { label: 'Total Resources', value: '24', icon: <BarChart3 size={22} />, color: '#6366f1' },
  { label: 'Active Users', value: '156', icon: <Users size={22} />, color: '#10b981' },
  { label: 'Bookings This Week', value: '38', icon: <CalendarCheck size={22} />, color: '#f59e0b' },
  { label: 'Open Tickets', value: '7', icon: <AlertTriangle size={22} />, color: '#ef4444' },
];

const recentActivity = [
  { text: 'Booking #42 approved for Computer Lab B', time: '2 min ago', icon: <CheckCircle2 size={16} />, color: '#10b981' },
  { text: 'Ticket #15 assigned to maintenance team', time: '18 min ago', icon: <Clock size={16} />, color: '#f59e0b' },
  { text: 'New resource "Lecture Hall D" added', time: '1 hour ago', icon: <TrendingUp size={16} />, color: '#6366f1' },
  { text: 'Booking #39 cancelled by user', time: '3 hours ago', icon: <AlertTriangle size={16} />, color: '#ef4444' },
  { text: 'Ticket #12 resolved — A/C fixed in Lab A', time: '5 hours ago', icon: <CheckCircle2 size={16} />, color: '#10b981' },
];

const Dashboard = () => {
  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: 12, borderRadius: 12, color: '#fff' }}>
          <BarChart3 size={28} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Admin Dashboard</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Campus operations overview and analytics.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ background: `${s.color}22`, color: s.color, padding: 12, borderRadius: 12 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns: chart placeholder + activity feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Chart placeholder */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem' }}>Weekly Booking Trends</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180 }}>
            {[35, 50, 42, 65, 55, 70, 38].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%', height: `${h * 2}px`, background: `linear-gradient(180deg, rgba(99,102,241,0.8), rgba(99,102,241,0.2))`,
                  borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease',
                }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <h3 style={{ padding: '1.25rem 1.5rem 0.75rem', margin: 0 }}>Recent Activity</h3>
          {recentActivity.map((a, i) => (
            <div key={i} style={{
              padding: '12px 1.5rem', display: 'flex', alignItems: 'center', gap: 12,
              borderTop: '1px solid var(--glass-border)',
            }}>
              <div style={{ color: a.color, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>{a.text}</p>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
