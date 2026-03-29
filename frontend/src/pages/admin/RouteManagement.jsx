import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FiPlus, FiTrash2, FiMap, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ source: '', destination: '', distanceKm: '', estimatedDuration: '' });

  useEffect(() => { fetchRoutes(); }, []);

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/routes');
      setRoutes(res.data);
    } catch (e) { toast.error('Failed to load routes.'); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/routes', { ...form, distanceKm: parseFloat(form.distanceKm) });
      toast.success('Route operationalized.');
      setForm({ source: '', destination: '', distanceKm: '', estimatedDuration: '' });
      setShowModal(false);
      fetchRoutes();
    } catch (e) { toast.error('Failed to add route.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this route?')) return;
    try {
      await api.delete(`/routes/${id}`);
      toast.success('Route removed.');
      fetchRoutes();
    } catch (e) { toast.error('Failed to remove route.'); }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>Network Operations</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Manage departure and destination logistics</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ padding: '12px 28px', borderRadius: '12px' }}>
          <FiPlus size={18} style={{ marginRight: '8px' }} /> Add Route
        </button>
      </header>

      <div className="glass-card" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
              {['Route ID', 'From', 'To', 'Distance', 'Estimated Duration', 'Actions'].map(h => (
                <th key={h} style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                <td style={{ padding: '20px 24px', color: 'var(--gold)', fontWeight: 700 }}>#{String(r.id).padStart(4, '0')}</td>
                <td style={{ padding: '20px 24px', color: 'var(--text-primary)', fontWeight: 600 }}>{r.source}</td>
                <td style={{ padding: '20px 24px', color: 'var(--text-primary)', fontWeight: 600 }}>{r.destination}</td>
                <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{r.distanceKm} km</td>
                <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{r.estimatedDuration}</td>
                <td style={{ padding: '20px 24px' }}>
                   <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => handleDelete(r.id)} style={{ background: 'transparent', border: 'none', color: '#3a3330', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#e05050'} onMouseLeave={e => e.currentTarget.style.color = '#3a3330'}>
                        <FiTrash2 size={18} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {routes.length === 0 && !loading && <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>No routes mapped yet.</div>}
      </div>

      {/* Add Route Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.3s' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '40px', borderRadius: '32px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><FiX size={24} /></button>
            <h3 style={{ marginBottom: '32px' }}>Operationalize Route</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="input-group">
                    <label>From (Source)</label>
                    <input type="text" placeholder="e.g. Bangalore" value={form.source} onChange={e => setForm({...form, source: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label>To (Destination)</label>
                    <input type="text" placeholder="e.g. Mumbai" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="input-group">
                        <label>Distance (km)</label>
                        <input type="number" placeholder="1000" value={form.distanceKm} onChange={e => setForm({...form, distanceKm: e.target.value})} required />
                    </div>
                    <div className="input-group">
                        <label>Duration</label>
                        <input type="text" placeholder="14h 30m" value={form.estimatedDuration} onChange={e => setForm({...form, estimatedDuration: e.target.value})} required />
                    </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                    <button type="submit" className="btn-primary" style={{ width: '100%', height: '54px' }}>Establish new premium route</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;
