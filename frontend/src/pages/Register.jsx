import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.', { style: { background: '#1c1c1c', color: '#f5f0e8', border: '1px solid rgba(224,80,80,0.4)' } });
      return;
    }
    setLoading(true);
    try {
      const result = await register({ fullName: formData.fullName, email: formData.email, phone: formData.phone, password: formData.password });
      if (result && result.success === false) {
        toast.error(result.message || 'Registration failed. Please try again.');
      } else {
        toast.success('Account created. Welcome aboard.');
        navigate('/');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toastStyle = { style: { background: '#1c1c1c', color: '#f5f0e8', border: '1px solid rgba(201,169,110,0.3)' } };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <Toaster position="bottom-right" />

      {/* Left Panel */}
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
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '64px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid #c9a96e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#c9a96e' }}>✦</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#f5f0e8' }}>Voyageur</span>
          </div>

          <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '16px', fontWeight: 500 }}>Join Today</p>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#f5f0e8', lineHeight: 1.15, marginBottom: '24px' }}>
            Your Journey<br />Begins Here.
          </h1>
          <div style={{ width: '48px', height: '2px', background: '#c9a96e', marginBottom: '24px', borderRadius: '2px' }} />
          <p style={{ color: '#6a5f52', fontSize: '1rem', maxWidth: '380px', lineHeight: 1.7 }}>
            Create your Voyageur profile and unlock a seamless, premium travel experience across India.
          </p>

          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Curated premium routes', 'Instant e-ticket delivery', 'Flexible cancellations'].map((feat) => (
              <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#8a7a6a', fontSize: '0.9rem' }}>
                <span style={{ color: '#c9a96e', fontSize: '10px' }}>✦</span>
                {feat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{ width: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 60px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.9rem', color: '#f5f0e8', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: '#6a5f52', fontSize: '0.9rem' }}>Join the Voyageur experience.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Full Name</label>
            <input type="text" placeholder="Your full name" value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Email Address</label>
            <input type="email" placeholder="your@email.com" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Phone Number</label>
            <input type="tel" placeholder="+91 00000 00000" value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Confirm</label>
              <input type="password" placeholder="••••••••" value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px', padding: '15px', fontSize: '0.9rem' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Creating account...
              </span>
            ) : 'Create Account →'}
          </button>
        </form>

        <p style={{ marginTop: '28px', color: '#5a5248', fontSize: '0.85rem', textAlign: 'center' }}>
          Already a member?{' '}
          <Link to="/login" style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Register;
