import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FiCheckCircle, FiXCircle, FiClock, FiDownload, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const toastStyle = { style: { background: '#1c1c1c', color: '#f5f0e8', border: '1px solid rgba(201,169,110,0.3)' } };

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings.', toastStyle);
    } finally { setLoading(false); }
  };

  const handleDownloadTicket = async (id) => {
    const toastId = toast.loading('Generating ticket...', toastStyle);
    try {
      const response = await api.get(`/bookings/${id}/ticket`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Voyageur_Ticket_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Ticket downloaded!', { id: toastId, ...toastStyle });
    } catch (error) {
      toast.error('Failed to download ticket.', { id: toastId, ...toastStyle });
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'CONFIRMED': return { icon: <FiCheckCircle size={12} />, label: 'Confirmed', cls: 'badge-confirmed' };
      case 'CANCELLED': return { icon: <FiXCircle size={12} />, label: 'Cancelled', cls: 'badge-cancelled' };
      default: return { icon: <FiClock size={12} />, label: 'Pending Approval', cls: 'badge-pending' };
    }
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '60px 0' }}>
      <Toaster position="bottom-right" />
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '52px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '12px', fontWeight: 500 }}>✦ Travel History</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#f5f0e8' }}>My Journeys</h1>
          <div style={{ width: '48px', height: '2px', background: '#c9a96e', marginTop: '14px', borderRadius: '2px' }} />
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '18px' }} />)}
          </div>
        ) : bookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map((booking, idx) => {
              const statusConfig = getStatusConfig(booking.status);
              return (
                <BookingCard key={booking.id} booking={booking} statusConfig={statusConfig} idx={idx} onDownload={handleDownloadTicket} />
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ color: '#3a3330', fontSize: '3.5rem', marginBottom: '20px' }}>✦</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#5a5248', marginBottom: '12px' }}>No journeys yet</p>
            <p style={{ color: '#3a3330', fontSize: '0.9rem', marginBottom: '32px' }}>Your travel history will appear here once you make a booking.</p>
            <Link to="/" className="btn-primary">Explore Routes →</Link>
          </div>
        )}
      </div>
    </div>
  );
};

const BookingCard = ({ booking, statusConfig, idx, onDownload }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#141414' : '#111',
        border: `1px solid ${hovered ? 'rgba(201,169,110,0.3)' : 'rgba(201,169,110,0.08)'}`,
        borderRadius: '18px',
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '28px',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
        animation: `fadeUp 0.4s ease ${idx * 0.07}s both`,
      }}
    >
      {/* PNR & Status */}
      <div style={{ minWidth: '160px' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#f5f0e8', marginBottom: '6px' }}>
          #{String(booking.id).padStart(6, '0')}
        </div>
        <span className={`badge ${statusConfig.cls}`}>
          {statusConfig.icon} {statusConfig.label}
        </span>
      </div>

      {/* Route */}
      <div style={{ flex: 1.5, padding: '0 20px', borderLeft: '1px solid rgba(201,169,110,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <span style={{ fontWeight: 600, color: '#f5f0e8', fontSize: '1rem' }}>{booking.source}</span>
          <FiArrowRight size={14} color="#c9a96e" />
          <span style={{ fontWeight: 600, color: '#f5f0e8', fontSize: '1rem' }}>{booking.destination}</span>
        </div>
        <p style={{ color: '#5a5248', fontSize: '0.8rem' }}>
          {booking.journeyDate} · {booking.busName} · {booking.seatCount} seat{booking.seatCount > 1 ? 's' : ''}
        </p>
        <p style={{ color: '#3a3330', fontSize: '0.75rem', marginTop: '4px' }}>
          Passenger: {booking.passengerName}
        </p>
      </div>

      {/* Fare */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#c9a96e' }}>
            ₹{booking.totalFare || booking.totalPrice}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#5a5248' }}>Total Fare</div>
        </div>
        {booking.status === 'CONFIRMED' && (
          <button
            onClick={() => onDownload(booking.id)}
            className="btn-secondary"
            style={{ padding: '8px 18px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiDownload size={13} /> e-Ticket
          </button>
        )}
      </div>
    </div>
  );
};

export default Bookings;
