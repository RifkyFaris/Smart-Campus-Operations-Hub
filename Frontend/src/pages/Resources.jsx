import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';
import { Layers } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/resources');
        setResources(response.data);
      } catch (err) {
        console.error('Failed to fetch resources', err);
        setError('Failed to connect to the backend API. Showing dummy data for design validation.');
        // Setting some dummy data for design validation in case backend is off
        setResources([
          { id: 1, name: 'Main Auditorium', type: 'ROOM', capacity: 300, location: 'Building A, 1st Floor', status: 'ACTIVE' },
          { id: 2, name: 'Computer Lab B', type: 'LAB', capacity: 45, location: 'Building B, 2nd Floor', status: 'OUT_OF_SERVICE' },
          { id: 3, name: 'Projector 4K', type: 'EQUIPMENT', capacity: 1, location: 'IT Desk', status: 'ACTIVE' },
          { id: 4, name: 'Conference Room 101', type: 'ROOM', capacity: 15, location: 'Building A, 1st Floor', status: 'ACTIVE' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))', padding: '12px', borderRadius: '12px', color: 'white' }}>
          <Layers size={28} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Facilities & Resources</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>View and manage campus physical assets.</p>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--status-warning)', color: 'var(--status-warning)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="glass-panel" style={{ height: '160px', animation: 'pulse 1.5s infinite alternate' }}>
              <style>{`@keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 0.8; } }`}</style>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
