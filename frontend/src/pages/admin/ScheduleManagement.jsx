import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FiPlus, FiTrash2, FiCalendar, FiClock, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ 
    busId: '', 
    routeId: '', 
    journeyDate: '', 
    departureTime: '', 
    arrivalTime: '', 
    fare: '' 
  });

  useEffect(() => { 
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const [sRes, bRes, rRes] = await Promise.all([
        api.get('/schedules'),
        api.get('/buses'),
        api.get('/routes')
      ]);
      setSchedules(sRes.data);
      setBuses(bRes.data);
      setRoutes(rRes.data);
    } catch (e) { toast.error('Failed to load operational data.'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/schedules', {
        ...form,
        busId: parseInt(form.busId),
        routeId: parseInt(form.routeId),
        fare: parseFloat(form.fare),
        // Spring expects HH:mm:ss for LocalTime
        departureTime: form.departureTime + ':00',
        arrivalTime: form.arrivalTime + ':00'
      });
      toast.success('Schedule deployed.');
      setForm({ busId: '', routeId: '', journeyDate: '', departureTime: '', arrivalTime: '', fare: '' });
      setShowModal(false);
      fetchData();
    } catch (e) { toast.error('Failed to deploy schedule.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this schedule?')) return;
    try {
      await api.delete(`/schedules/${id}`);
      toast.success('Schedule deactivated.');
      fetchData();
    } catch (e) { toast.error('Failed to deactivate.'); }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>Operational Schedules</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Deploy and manage bus timings and availability</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ padding: '12px 28px', borderRadius: '12px' }}>
          <FiPlus size={18} style={{ marginRight: '8px' }} /> Deploy Schedule
        </button>
      </header>

      <div className="glass-card" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
              {['Service', 'Route', 'Date', 'Departure', 'Fare', 'Fleet Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{s.busName}</div>
                  <div style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700 }}>{s.busNumber}</div>
                </td>
                <td style={{ padding: '20px 24px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.source} → {s.destination}</td>
                <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.journeyDate}</td>
                <td style={{ padding: '20px 24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <FiClock size={14} style={{ color: 'var(--gold)' }} /> {s.departureTime}
                   </div>
                </td>
                <td style={{ padding: '20px 24px', color: 'var(--text-primary)', fontWeight: 700 }}>₹{s.fare}</td>
                <td style={{ padding: '20px 24px' }}>
                   <span style={{ color: s.availableSeats > 5 ? '#4caf7d' : '#e05050', fontSize: '0.8rem', fontWeight: 600 }}>{s.availableSeats} LEFT</span>
                </td>
                <td style={{ padding: '20px 24px' }}>
                      <button onClick={() => handleDelete(s.id)} style={{ background: 'transparent', border: 'none', color: '#3a3330', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#e05050'} onMouseLeave={e => e.currentTarget.style.color = '#3a3330'}>
                        <FiTrash2 size={18} />
                      </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {schedules.length === 0 && !loading && <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>No active deployments.</div>}
      </div>

      {/* Deploy Schedule Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.3s' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '40px', borderRadius: '32px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><FiX size={24} /></button>
            <h3 style={{ marginBottom: '32px' }}>Operational Deployment</h3>
            <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                    <label>Assigned Vehicle</label>
                    <select value={form.busId} onChange={e => setForm({...form, busId: e.target.value})} required>
                        <option value="">Select Fleet</option>
                        {buses.map(b => (
                            <option key={b.id} value={b.id}>{b.busName} ({b.busNumber})</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label>Active Route</label>
                    <select value={form.routeId} onChange={e => setForm({...form, routeId: e.target.value})} required>
                        <option value="">Select Path</option>
                        {routes.map(r => (
                            <option key={r.id} value={r.id}>{r.source} → {r.destination}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label>Journey Date</label>
                    <input type="date" value={form.journeyDate} onChange={e => setForm({...form, journeyDate: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label>Premium Fare (₹)</label>
                    <input type="number" placeholder="₹1200" value={form.fare} onChange={e => setForm({...form, fare: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label>Departure Time</label>
                    <input type="time" value={form.departureTime} onChange={e => setForm({...form, departureTime: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label>Arrival Time</label>
                    <input type="time" value={form.arrivalTime} onChange={e => setForm({...form, arrivalTime: e.target.value})} required />
                </div>
                <div style={{ gridColumn: '1/-1', marginTop: '16px' }}>
                    <button type="submit" className="btn-primary" style={{ width: '100%', height: '54px' }}>Deploy schedule to global booking engine</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
