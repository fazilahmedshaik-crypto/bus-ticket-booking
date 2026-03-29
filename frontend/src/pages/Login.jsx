import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result && result.success === false) {
        toast.error(result.message || 'Invalid credentials. Please try again.');
      } else {
        toast.success('Welcome back.');
        navigate('/');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <Toaster position="bottom-right" />

      {/* Left Panel — Brand */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '80px',
        background: 'linear-gradient(145deg, #0f0f0f 0%, #141414 100%)',
        borderRight: '1px solid rgba(201,169,110,0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background accent */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '64px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid #c9a96e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#c9a96e' }}>✦</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#f5f0e8' }}>Voyageur</span>
          </div>

          <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '16px', fontWeight: 500 }}>Premium Bus Travel</p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#f5f0e8', lineHeight: 1.1, marginBottom: '24px' }}>
            Travel,<br />Redefined.
          </h1>
          <div style={{ width: '48px', height: '2px', background: '#c9a96e', marginBottom: '24px', borderRadius: '2px' }} />
          <p style={{ color: '#6a5f52', fontSize: '1rem', maxWidth: '380px', lineHeight: 1.7 }}>
            Premium routes. Seamless booking. An experience crafted for the discerning traveller.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{ width: '480px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 60px' }}>
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#f5f0e8', marginBottom: '8px' }}>Sign In</h2>
          <p style={{ color: '#6a5f52', fontSize: '0.9rem' }}>Welcome back. Continue your journey.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px', padding: '15px', fontSize: '0.9rem' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Signing in...
              </span>
            ) : 'Continue →'}
          </button>
        </form>

        <p style={{ marginTop: '32px', color: '#5a5248', fontSize: '0.85rem', textAlign: 'center' }}>
          New to Voyageur?{' '}
          <Link to="/register" style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 500 }}>
            Create an account
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
