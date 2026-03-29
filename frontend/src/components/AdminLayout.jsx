import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiMap, FiTruck, FiCalendar, FiUsers, FiLogOut, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: <FiGrid size={18} />, label: 'Overview', end: true },
    { to: '/admin/buses', icon: <FiTruck size={18} />, label: 'Buses' },
    { to: '/admin/routes', icon: <FiMap size={18} />, label: 'Routes' },
    { to: '/admin/schedules', icon: <FiCalendar size={18} />, label: 'Schedules' },
    { to: '/admin/users', icon: <FiUsers size={18} />, label: 'Users' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        height: '100vh', 
        position: 'fixed', 
        left: 0, top: 0, 
        background: 'rgba(10,10,10,0.95)', 
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100
      }}>
        <div style={{ padding: '40px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>V</div>
          <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>Voyageur<br /><small style={{ fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Portal</small></span>
        </div>

        <nav style={{ flex: 1, padding: '0 16px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 20px',
                borderRadius: '12px',
                color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                background: isActive ? 'rgba(201,169,110,0.1)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: '4px',
                transition: 'all 0.3s ease',
                border: isActive ? '1px solid rgba(201,169,110,0.2)' : '1px solid transparent'
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '32px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 20px',
              borderRadius: '12px',
              color: 'var(--text-muted)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#e05050'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: '280px', flex: 1, padding: '48px 60px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
