import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { AlertTriangle, Plus, X, ArrowUpCircle, ArrowRightCircle, ArrowDownCircle, CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';

const PRIORITY_MAP = {
  HIGH:   { color: '#ef4444', icon: <ArrowUpCircle size={14} /> },
  MEDIUM: { color: '#f59e0b', icon: <ArrowRightCircle size={14} /> },
  LOW:    { color: '#10b981', icon: <ArrowDownCircle size={14} /> },
};

const STATUS_MAP = {
  OPEN:        { color: '#6366f1', icon: <Clock size={14} /> },
  IN_PROGRESS: { color: '#f59e0b', icon: <RefreshCw size={14} /> },
  RESOLVED:    { color: '#10b981', icon: <CheckCircle2 size={14} /> },
  CLOSED:      { color: '#64748b', icon: <CheckCircle2 size={14} /> },
  REJECTED:    { color: '#ef4444', icon: <XCircle size={14} /> },
};

const Badge = ({ map, value }) => {
  const st = map[value] || { color: '#94a3b8', icon: null };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: st.color, background: `${st.color}22`, padding: '4px 12px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600 }}>
      {st.icon}{value?.replace(/_/g, ' ')}
    </span>
  );
};

const TicketCard = ({ ticket }) => {
  const pri = PRIORITY_MAP[ticket.priority] || PRIORITY_MAP.LOW;
  return (
    <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: '1.5rem' }}>
      {/* Priority accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: pri.color }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>#{ticket.id}</span>
        <Badge map={STATUS_MAP} value={ticket.status} />
      </div>

      <p style={{ margin: '0.5rem 0 1rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>{ticket.description}</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
        <Badge map={PRIORITY_MAP} value={ticket.priority} />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertTriangle size={14} />{ticket.category?.replace(/_/g, ' ')}
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : ''}
        </span>
      </div>
    </div>
  );
};

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ resourceId: '', category: '', priority: 'MEDIUM', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tRes, rRes] = await Promise.all([api.get('/tickets'), api.get('/resources')]);
      setTickets(tRes.data);
      setResources(rRes.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tickets', err);
      setError('Could not reach backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // reporterId=1 is a placeholder; in a real app it comes from auth context
      await api.post('/tickets/reporter/1', {
        resourceId: Number(form.resourceId),
        category: form.category,
        priority: form.priority,
        description: form.description,
      });
      setShowForm(false);
      setForm({ resourceId: '', category: '', priority: 'MEDIUM', description: '' });
      fetchAll();
    } catch (err) {
      alert('Ticket creation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', padding: 12, borderRadius: 12, color: '#fff' }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Incident Tickets</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Report and track campus issues.</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={18} />Cancel</> : <><Plus size={18} />Report Issue</>}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid var(--status-warning)', color: 'var(--status-warning)', padding: '1rem', borderRadius: 8, marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Ticket Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1' }}><h3 style={{ margin: 0 }}>Report a New Incident</h3></div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Affected Resource</label>
            <select required value={form.resourceId} onChange={e => setForm({ ...form, resourceId: e.target.value })}>
              <option value="">Select resource…</option>
              {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Category</label>
            <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category…</option>
              {['HARDWARE', 'SOFTWARE', 'NETWORK', 'FACILITIES', 'OTHER'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Priority</label>
            <select required value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              {['LOW', 'MEDIUM', 'HIGH'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Description</label>
            <textarea required rows={4} placeholder="Describe the issue in detail…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Ticket'}</button>
          </div>
        </form>
      )}

      {/* Ticket Cards Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-panel" style={{ height: 180, animation: 'pulse 1.5s infinite alternate' }}>
              <style>{`@keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 0.8; } }`}</style>
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No tickets found. Everything is running smoothly! 🎉
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {tickets.map(t => <TicketCard key={t.id} ticket={t} />)}
        </div>
      )}
    </div>
  );
};

export default Tickets;
