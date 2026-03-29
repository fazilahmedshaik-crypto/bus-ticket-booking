import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FiUsers, FiSearch, FiTrash2, FiMail, FiPhone, FiShield } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (e) { toast.error('Failed to load user database.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Revoke access for this account?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Account deactivated.');
      fetchUsers();
    } catch (e) { toast.error('Failed to deactivate.'); }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>Passenger Directory</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Manage user accounts and global access</p>
        </div>
        
        <div style={{ position: 'relative', width: '320px' }}>
            <FiSearch size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ 
                    width: '100%', 
                    paddingLeft: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: 'var(--bg-elevated)', 
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)'
                }}
            />
        </div>
      </header>

      <div className="glass-card" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
              {['Passenger', 'Contact Info', 'Role', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: u.role === 'ADMIN' ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: u.role === 'ADMIN' ? 'var(--gold)' : 'var(--text-muted)' }}>
                      <FiUsers size={18} />
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.fullName}</div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '4px' }}>
                        <FiMail size={12} style={{ opacity: 0.5 }} /> {u.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <FiPhone size={12} style={{ opacity: 0.5 }} /> {u.phone}
                    </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {u.role === 'ADMIN' && <FiShield size={14} style={{ color: 'var(--gold)' }} />}
                    <span style={{ color: u.role === 'ADMIN' ? 'var(--gold)' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>{u.role}</span>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf7d' }} />
                      <span style={{ fontSize: '0.8rem', color: '#4caf7d', fontWeight: 600 }}>ACTIVE</span>
                   </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                    {u.role !== 'ADMIN' && (
                      <button onClick={() => handleDelete(u.id)} style={{ background: 'transparent', border: 'none', color: '#3a3330', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#e05050'} onMouseLeave={e => e.currentTarget.style.color = '#3a3330'}>
                        <FiTrash2 size={18} />
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && !loading && <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>No passengers found matching your criteria.</div>}
      </div>
    </div>
  );
};

export default UserManagement;
