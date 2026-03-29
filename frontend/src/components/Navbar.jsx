import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px',
    height: '64px',
    background: scrolled ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${scrolled ? 'rgba(201,169,110,0.2)' : 'rgba(201,169,110,0.08)'}`,
    transition: 'all 0.3s ease',
  };

  const linkStyle = (path) => ({
    color: isActive(path) ? '#c9a96e' : '#a09080',
    textDecoration: 'none',
    fontSize: '0.82rem',
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '4px 0',
    borderBottom: `1px solid ${isActive(path) ? '#c9a96e' : 'transparent'}`,
    transition: 'color 0.2s ease, border-color 0.2s ease',
  });

  return (
    <nav style={navStyle}>
      {/* Brand */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #c9a96e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px' }}>✦</span>
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#f5f0e8', letterSpacing: '0.04em' }}>
          Voyageur
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
        <Link to="/" style={linkStyle('/')}
          onMouseEnter={e => { e.target.style.color = '#c9a96e'; }}
          onMouseLeave={e => { e.target.style.color = isActive('/') ? '#c9a96e' : '#a09080'; }}>
          Book
        </Link>
        <Link to="/bookings" style={linkStyle('/bookings')}
          onMouseEnter={e => { e.target.style.color = '#c9a96e'; }}
          onMouseLeave={e => { e.target.style.color = isActive('/bookings') ? '#c9a96e' : '#a09080'; }}>
          My Journeys
        </Link>
        {user?.role === 'ADMIN' && (
          <Link to="/admin" style={linkStyle('/admin')}
            onMouseEnter={e => { e.target.style.color = '#c9a96e'; }}
            onMouseLeave={e => { e.target.style.color = isActive('/admin') ? '#c9a96e' : '#a09080'; }}>
            Admin
          </Link>
        )}
      </div>

      {/* User Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '6px 16px 6px 8px', borderRadius: '100px', border: '1px solid rgba(201,169,110,0.15)' }}>
          <div style={{ 
            width: '32px', height: '32px', 
            borderRadius: '50%', 
            background: 'var(--gold-gradient)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--gold-glow)'
          }}>
            <FiUser size={14} color="#000" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#f5f0e8', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>{user?.fullName?.split(' ')[0] || 'Guest'}</span>
            <span style={{ fontSize: '0.6rem', color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Elite Member</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{ background: 'transparent', border: 'none', color: '#a09080', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', transition: 'all 0.2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#c9a96e'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#a09080'; }}
          title="Sign Out"
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
