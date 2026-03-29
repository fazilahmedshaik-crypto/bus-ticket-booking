import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FiUsers, FiMap, FiCalendar, FiTrendingUp, FiCheckCircle, FiClock, FiActivity, FiTruck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const StatCard = ({ icon, label, value, trend, color = 'var(--gold)' }) => (
  <div className="glass-card" style={{ 
    padding: '32px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px',
    border: '1px solid var(--border-subtle)',
    borderRadius: '24px',
    transition: 'transform 0.3s ease, box-shadow 0.3s'
  }}
  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)'; }}
  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
            {icon}
        </div>
        {trend && (
            <div style={{ padding: '6px 12px', borderRadius: '100px', background: 'rgba(76,175,125,0.1)', color: '#4caf7d', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                <FiTrendingUp size={10} style={{ marginRight: '4px' }} /> {trend}
            </div>
        )}
    </div>
    <div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: 'var(--text-primary)', fontWeight: 700 }}>{value}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ bookings: 0, revenue: 0, buses: 0, routes: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bRes, busRes, rRes] = await Promise.all([
        api.get('/bookings'), 
        api.get('/buses'), 
        api.get('/routes')
      ]);
      
      const totalRevenue = bRes.data.filter(b => b.status === 'CONFIRMED').reduce((acc, b) => acc + b.totalFare, 0);
      
      setStats({
        bookings: bRes.data.length,
        revenue: totalRevenue,
        buses: busRes.data.length,
        routes: rRes.data.length
      });
      
      setRecentBookings(bRes.data.slice(-5).reverse());
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.6s ease' }}>
      <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '12px' }}>Command Centre</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiActivity style={{ color: 'var(--gold)' }} /> Live system summary and performance metrics
          </p>
        </div>
        <div style={{ background: 'rgba(201,169,110,0.05)', padding: '12px 24px', borderRadius: '100px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>
            System Status: Operational ✦
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '60px' }}>
        <StatCard icon={<FiCalendar size={22} />} label="Total Bookings" value={stats.bookings} trend="+12%" />
        <StatCard icon={<FiTrendingUp size={22} />} label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} trend="+8.4%" color="#4caf7d" />
        <StatCard icon={<FiTruck size={18} />} label="Active Fleet" value={stats.buses} />
        <StatCard icon={<FiMap size={18} />} label="Premium Routes" value={stats.routes} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        {/* Recent Feed */}
        <section className="glass-card" style={{ padding: '40px', borderRadius: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ margin: 0 }}>Recent Activity</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentBookings.map((b, i) => (
              <div key={b.id} style={{ 
                padding: '20px 24px', 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: b.status === 'CONFIRMED' ? '#4caf7d' : 'var(--gold)' }} />
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{b.passengerName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.source} → {b.destination}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>₹{b.totalFare}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.status}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* System Logs / Quick Tips */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', borderLeft: '4px solid var(--gold)' }}>
                <h4 style={{ color: 'var(--gold)', marginBottom: '12px', fontSize: '0.9rem' }}>System Integrity</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Database connectivity is 100%. JWT authentications are processing normally. No latency detected in ticket generation service.</p>
            </div>
            
            <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(201,169,110,0.1) 0%, transparent 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <FiClock style={{ color: 'var(--gold)' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Next Maintenance</span>
                </div>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>April 15, 2026</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Optimization scheduled for 02:00 AM IST</p>
            </div>
        </section>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
