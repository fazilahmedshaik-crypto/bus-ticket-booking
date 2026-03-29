import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FiPlus, FiTrash2, FiTruck, FiInfo, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ busName: '', busNumber: '', busType: 'AC', totalSeats: 40, operatorName: '', amenities: '' });

  useEffect(() => { fetchBuses(); }, []);

  const fetchBuses = async () => {
    try {
      const res = await api.get('/buses');
      setBuses(res.data);
    } catch (e) { toast.error('Failed to load fleet.'); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/buses', { ...form, totalSeats: parseInt(form.totalSeats) });
      toast.success('Boutique bus added to fleet.');
      setForm({ busName: '', busNumber: '', busType: 'AC', totalSeats: 40, operatorName: '', amenities: '' });
      setShowModal(false);
      fetchBuses();
    } catch (e) { toast.error('Failed to add bus.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Decommission this vehicle?')) return;
    try {
      await api.delete(`/buses/${id}`);
      toast.success('Bus removed.');
      fetchBuses();
    } catch (e) { toast.error('Failed to remove bus.'); }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>Fleet Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Manage your luxury bus inventory and amenities</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ padding: '12px 28px', borderRadius: '12px' }}>
          <FiPlus size={18} style={{ marginRight: '8px' }} /> Add New Bus
        </button>
      </header>

      <div className="glass-card" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
              {['Vehicle', 'License', 'Operator', 'Class', 'Capacity', 'Actions'].map(h => (
                <th key={h} style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {buses.map((bus, i) => (
              <tr key={bus.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                      <FiTruck size={18} />
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{bus.busName}</div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{bus.busNumber}</td>
                <td style={{ padding: '20px 24px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{bus.operatorName}</td>
                <td style={{ padding: '20px 24px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(201,169,110,0.2)', color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 600 }}>{bus.busType}</span>
                </td>
                <td style={{ padding: '20px 24px', color: 'var(--text-secondary)' }}>{bus.totalSeats} seats</td>
                <td style={{ padding: '20px 24px' }}>
                   <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => handleDelete(bus.id)} style={{ background: 'transparent', border: 'none', color: '#3a3330', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#e05050'} onMouseLeave={e => e.currentTarget.style.color = '#3a3330'}>
                        <FiTrash2 size={18} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {buses.length === 0 && !loading && <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>No vehicles in fleet.</div>}
      </div>

      {/* Add Bus Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.3s' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '40px', borderRadius: '32px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><FiX size={24} /></button>
            <h3 style={{ marginBottom: '32px' }}>Add Premium Vehicle</h3>
            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="input-group">
                    <label>Bus Name</label>
                    <input type="text" placeholder="e.g. Volvo 9400" value={form.busName} onChange={e => setForm({...form, busName: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label>Bus Number</label>
                    <input type="text" placeholder="KA-01-F-1234" value={form.busNumber} onChange={e => setForm({...form, busNumber: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label>Operator</label>
                    <input type="text" placeholder="e.g. KSRTC" value={form.operatorName} onChange={e => setForm({...form, operatorName: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label>Capacity</label>
                    <input type="number" placeholder="40" value={form.totalSeats} onChange={e => setForm({...form, totalSeats: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label>Bus Class</label>
                    <select value={form.busType} onChange={e => setForm({...form, busType: e.target.value})}>
                        <option value="AC">AC Seater</option>
                        <option value="SLEEPER">Executive Sleeper</option>
                        <option value="NON_AC">Classic Seater</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Amenities</label>
                    <input type="text" placeholder="WiFi, Water, AC" value={form.amenities} onChange={e => setForm({...form, amenities: e.target.value})} />
                </div>
                <div style={{ gridColumn: '1/-1', marginTop: '16px' }}>
                    <button type="submit" className="btn-primary" style={{ width: '100%', height: '54px' }}>Add vehicle to active fleet</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusManagement;
