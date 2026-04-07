import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X } from 'lucide-react';
import api from '../services/api';

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // userId=1 is a placeholder; in a real app it comes from auth context
      const res = await api.get('/notifications/user/1');
      setNotifications(res.data);
    } catch {
      setNotifications([
        { id: 1, message: 'Your booking for Main Auditorium was approved.', isRead: false, createdAt: '2026-04-07T10:30:00' },
        { id: 2, message: 'Ticket #3 has been resolved by the maintenance team.', isRead: false, createdAt: '2026-04-06T16:00:00' },
        { id: 3, message: 'New resource "Seminar Hall C" has been added.', isRead: true, createdAt: '2026-04-05T11:00:00' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch { /* ignore if backend is offline */ }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  // Close panel when clicking outside
  useEffect(() => {
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)',
          position: 'relative', padding: 8,
        }}
        aria-label="Notifications"
        id="notification-bell"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%',
            background: 'var(--status-danger)', color: '#fff', fontSize: '0.7rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: 380, maxHeight: 440,
          background: 'rgba(30,41,59,0.95)', backdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)', borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden',
          animation: 'slideDown 0.2s ease',
        }}>
          <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }`}</style>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h4>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ overflowY: 'auto', maxHeight: 370 }}>
            {loading ? (
              <p style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading…</p>
            ) : notifications.length === 0 ? (
              <p style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>No notifications yet.</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  style={{
                    padding: '14px 20px', borderBottom: '1px solid var(--glass-border)',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    background: n.isRead ? 'transparent' : 'rgba(99,102,241,0.06)',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                    background: n.isRead ? 'transparent' : 'var(--brand-primary)',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>{n.message}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4, display: 'block' }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      title="Mark as read"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
                        padding: 4, flexShrink: 0, transition: 'color 0.2s',
                      }}
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
