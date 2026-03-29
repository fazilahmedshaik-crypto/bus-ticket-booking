import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FiX, FiCheckCircle, FiUser, FiSmartphone, FiMail, FiCreditCard, FiDownload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const toastStyle = { style: { background: '#1c1c1c', color: '#f5f0e8', border: '1px solid rgba(201,169,110,0.3)' } };
const STEPS = ['Select Seats', 'Passenger Info', 'Payment', 'Success'];

const BookingFlow = ({ schedule, onCancel, onSuccess }) => {
  const [step, setStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingData, setBookingData] = useState({
    scheduleId: schedule.id,
    seatCount: 1,
    passengerName: '',
    passengerPhone: '',
    passengerEmail: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // Mock booked seats
  const [bookedSeats] = useState(() => {
    const booked = [];
    for (let i = 1; i <= 40; i++) {
        if ((i * (schedule.id || 1)) % 7 === 0 || (i * (schedule.id || 1)) % 11 === 0) booked.push(i);
    }
    return booked;
  });

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
        toast.error('Please select at least one seat.', toastStyle);
        return;
    }
    setLoading(true);
    try {
      const payload = { ...bookingData, seatCount: selectedSeats.length };
      const response = await api.post('/bookings', payload);
      setBookingId(response.data.id);
      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Booking failed.', toastStyle);
    } finally { setLoading(false); }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await api.post('/payments/process', { bookingId, paymentMethod });
      setStep(3);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Payment declined. Please try again.', toastStyle);
    } finally { setLoading(false); }
  };

  const handleDownloadTicket = async () => {
    const toastId = toast.loading('Generating your e-ticket...', toastStyle);
    try {
      const response = await api.get(`/bookings/${bookingId || 1}/ticket`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Voyageur_Ticket_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Ticket downloaded!', { id: toastId, ...toastStyle });
    } catch (error) {
      toast.error('Failed to generate ticket.', { id: toastId, ...toastStyle });
    }
  };

  const totalFare = (schedule.fare || schedule.price) * (selectedSeats.length || 0);

  return (
    <div className="booking-flow animate-fadeIn" style={{ 
      background: 'rgba(10,10,10,0.6)', 
      borderRadius: '16px', 
      marginTop: '24px', 
      borderTop: '1px solid rgba(201,169,110,0.1)',
      overflow: 'hidden'
    }}>
      
      {/* Progress Header */}
      <div style={{ background: 'rgba(201,169,110,0.03)', padding: '24px 32px', borderBottom: '1px solid rgba(201,169,110,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{STEPS[step]}</h3>
          <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><FiX size={20}/></button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
            {STEPS.map((_, i) => (
                <div key={i} style={{ 
                    flex: 1, height: '3px', borderRadius: '2px',
                    background: i <= step ? 'var(--gold)' : 'rgba(201,169,110,0.1)',
                    transition: 'all 0.4s ease'
                }} />
            ))}
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        
        {/* STEP 0: SEATS (COACH MAP) */}
        {step === 0 && (
          <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', justifyContent: 'center', animation: 'animate-fadeUp 0.8s ease' }}>
            {/* ── Visual Coach Map ── */}
            <div style={{ 
                background: '#0a0a0a', 
                padding: '40px 30px', 
                borderRadius: '40px 40px 20px 20px', 
                border: '1px solid var(--border-medium)',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 20px 50px rgba(0,0,0,0.5)',
                position: 'relative',
                width: 'fit-content'
            }}>
               {/* Cockpit Area */}
               <div style={{ position: 'absolute', top: '-10px', left: '15%', right: '15%', height: '12px', background: '#111', borderRadius: '10px 10px 0 0', border: '1px solid var(--border-subtle)' }} />
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '0 10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                     <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                        <div style={{ width: '12px', height: '2px', background: '#222', borderRadius: '2px' }} />
                     </div>
                     <span style={{ fontSize: '0.6rem', color: '#222', textTransform: 'uppercase', fontWeight: 700 }}>Pilot</span>
                  </div>
                  <div style={{ width: '40px', height: '3px', background: '#111', borderRadius: '2px' }} />
               </div>
               
               {/* 2x1 Seating Layout */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Array.from({ length: 10 }).map((_, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex', gap: '32px' }}>
                        {/* Right side (2 seats) */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {[rowIndex * 3 + 1, rowIndex * 3 + 2].map(num => (
                                <Seat 
                                    key={num} 
                                    number={num} 
                                    isBooked={bookedSeats.includes(num)} 
                                    isSelected={selectedSeats.includes(num)} 
                                    onClick={() => handleSeatClick(num)} 
                                />
                            ))}
                        </div>
                        {/* Aisle */}
                        <div style={{ width: '20px' }} />
                        {/* Left side (1 seat) */}
                        <Seat 
                            number={rowIndex * 3 + 3} 
                            isBooked={bookedSeats.includes(rowIndex * 3 + 3)} 
                            isSelected={selectedSeats.includes(rowIndex * 3 + 3)} 
                            onClick={() => handleSeatClick(rowIndex * 3 + 3)} 
                        />
                    </div>
                  ))}
               </div>
               
               <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.65rem', color: '#222', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 800 }}>
                  ✦ Voyageur Luxury Coach ✦
               </div>
            </div>

            {/* ── Selection Summary ── */}
            <div style={{ width: '320px' }}>
                <div className="glass-card" style={{ padding: '32px', borderRadius: '28px', border: '1px solid rgba(201,169,110,0.15)' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Your Selection</span>
                        <h4 style={{ margin: '8px 0 0', fontSize: '1.2rem' }}>{selectedSeats.length} Reserved Seats</h4>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                        {selectedSeats.length > 0 ? selectedSeats.sort((a,b)=>a-b).map(s => (
                            <div key={s} className="badge badge-confirmed" style={{ fontSize: '0.75rem', padding: '6px 14px' }}>Seat {s}</div>
                        )) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Please select your preferred seats...</span>
                        )}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Base Fare</span>
                        <span style={{ color: 'var(--text-primary)' }}>₹{(schedule.fare || schedule.price).toLocaleString()}</span>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(201,169,110,0.1)', paddingTop: '20px', marginBottom: '32px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Total Payable</span>
                            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>
                                ₹{totalFare.toLocaleString()}
                            </span>
                         </div>
                    </div>

                    <button 
                        className="btn-primary" 
                        style={{ width: '100%', height: '56px' }}
                        disabled={selectedSeats.length === 0}
                        onClick={() => setStep(1)}
                    >
                        Confirm Experience →
                    </button>
                    
                    <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '20px' }}>
                         <Legend color="#0a0a0a" label="Avail" />
                         <Legend color="var(--gold)" label="Select" />
                         <Legend color="#111" label="Taken" />
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* STEP 1: DETAILS */}
        {step === 1 && (
            <div style={{ maxWidth: '480px', margin: '0 auto', animation: 'animate-fadeUp 0.8s ease' }}>
                <form onSubmit={handleCreateBooking}>
                    <div className="input-group">
                        <label><FiUser style={{marginRight: '8px', color: 'var(--gold)'}}/> Lead Passenger</label>
                        <input type="text" placeholder="Full name for the booking" required
                            value={bookingData.passengerName} onChange={e => setBookingData({...bookingData, passengerName: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label><FiSmartphone style={{marginRight: '8px', color: 'var(--gold)'}}/> Mobile</label>
                            <input type="tel" placeholder="10-digit number" required
                                value={bookingData.passengerPhone} onChange={e => setBookingData({...bookingData, passengerPhone: e.target.value})} />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label><FiMail style={{marginRight: '8px', color: 'var(--gold)'}}/> Email</label>
                            <input type="email" placeholder="For elite e-ticket" required
                                value={bookingData.passengerEmail} onChange={e => setBookingData({...bookingData, passengerEmail: e.target.value})} />
                        </div>
                    </div>

                    <div style={{ 
                        background: 'rgba(201,169,110,0.03)', 
                        borderRadius: '16px', 
                        padding: '24px', 
                        marginBottom: '32px', 
                        border: '1px solid rgba(201,169,110,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                            <FiCheckCircle size={20} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>Ready to reserve {selectedSeats.length} seats</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confirmed fare: ₹{totalFare.toLocaleString()}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" className="btn-secondary" onClick={() => setStep(0)} style={{ flex: 1 }}>Modify Seats</button>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, height: '54px' }}>
                            {loading ? 'Processing...' : 'Proceed to Payment →'}
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* STEP 3: PAYMENT & SECURE PROCESSING */}
        {step === 2 && (
             <div style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center', animation: 'animate-fadeUp 0.8s ease' }}>
                {loading ? (
                    <div style={{ padding: '60px 0' }}>
                        <div style={{ 
                            width: '100px', height: '100px', 
                            margin: '0 auto 40px', 
                            borderRadius: '50%',
                            border: '3px solid rgba(201,169,110,0.1)',
                            borderTopColor: 'var(--gold)',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <h2 className="shimmer-text">Processing Security Layer</h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Securing your transaction through Voyageur Encrypted Gateway...</p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '40px' }}>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 800 }}>Secure Checkout</span>
                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: '800', marginTop: '10px' }}>₹{totalFare.toLocaleString()}</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                            {[
                                { id: 'CARD', label: 'Credit / Debit Card', icon: <FiCreditCard /> },
                                { id: 'UPI', label: 'UPI / GPay / Instant', icon: <span style={{ fontWeight: 800 }}>UPI</span> },
                                { id: 'NETBANKING', label: 'Global Net Banking', icon: <FiCheckCircle /> }
                            ].map(method => (
                                <div key={method.id} 
                                    onClick={() => setPaymentMethod(method.id)}
                                    style={{ 
                                        padding: '24px', borderRadius: '18px', cursor: 'pointer',
                                        background: paymentMethod === method.id ? 'rgba(201,169,110,0.08)' : 'var(--bg-elevated)',
                                        border: `1px solid ${paymentMethod === method.id ? 'var(--gold)' : 'var(--border-subtle)'}`,
                                        display: 'flex', alignItems: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: paymentMethod === method.id ? 'var(--gold-glow)' : 'none'
                                    }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
                                        {paymentMethod === method.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--gold)' }} />}
                                    </div>
                                    <span style={{ color: paymentMethod === method.id ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: '600', fontSize: '1rem' }}>
                                        {method.label}
                                    </span>
                                    <div style={{ marginLeft: 'auto', opacity: 0.4 }}>{method.icon}</div>
                                </div>
                            ))}
                        </div>

                        <button className="btn-primary" onClick={handlePayment} style={{ width: '100%', height: '64px', fontSize: '1rem' }}>
                            Verify & Pay Securely →
                        </button>
                        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            <FiShield size={14} color="#4caf7d" /> Bank-grade 256-bit Encryption Active
                        </div>
                    </>
                )}
             </div>
        )}

        {/* STEP 4: SUCCESS (ELITE TICKET) */}
        {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0', animation: 'animate-fadeUp 1s ease' }}>
                 <div style={{ 
                    width: '120px', height: '120px', 
                    borderRadius: '50%', 
                    background: 'rgba(76,175,125,0.05)', 
                    border: '1px solid rgba(76,175,125,0.3)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 40px',
                    animation: 'pulse-gold 2s infinite'
                }}>
                    <FiCheckCircle size={60} color="#4caf7d" />
                 </div>
                 
                 <h1 className="shimmer-text" style={{ fontSize: '2.4rem', marginBottom: '12px' }}>Welcome Aboard!</h1>
                 <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '48px' }}>Your premium journey with Voyageur is confirmed.</p>
                 
                 <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto 48px', padding: '40px', textAlign: 'left', borderRadius: '32px' }}>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 48px' }}>
                        <InfoItem label="Reference PNR" value={`VQ-${String(bookingId).padStart(6,'0')}`} />
                        <InfoItem label="Assigned Seats" value={selectedSeats.sort((a,b)=>a-b).join(', ')} />
                        <InfoItem label="Departure" value={schedule.journeyDate} />
                        <InfoItem label="Scheduled Time" value={schedule.departureTime} />
                        <InfoItem label="Lead Guest" value={bookingData.passengerName} />
                        <InfoItem label="Total Fare" value={`₹${totalFare.toLocaleString()}`} />
                     </div>
                 </div>

                 <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <button className="btn-secondary" onClick={handleDownloadTicket} style={{ padding: '0 32px', height: '56px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FiDownload size={20} /> Download E-Ticket
                    </button>
                    <button className="btn-primary" onClick={onSuccess} style={{ height: '56px', padding: '0 40px' }}>Finalize & Exit</button>
                 </div>
            </div>
        )}

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes animate-fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const Seat = ({ number, isBooked, isSelected, onClick }) => {
    const [hover, setHover] = useState(false);
    return (
        <div 
            onClick={onClick}
            onMouseEnter={() => !isBooked && setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                width: '46px', height: '54px', borderRadius: '12px 12px 4px 4px',
                cursor: isBooked ? 'not-allowed' : 'pointer',
                background: isBooked ? '#111' : isSelected ? 'var(--gold)' : '#050505',
                border: `1.5px solid ${isBooked ? '#1a1a1a' : isSelected ? 'var(--gold)' : hover ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: isSelected ? '#000' : isBooked ? '#222' : 'var(--text-secondary)',
                fontSize: '0.85rem', fontWeight: 800, position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
                transform: hover && !isBooked ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isSelected ? 'var(--gold-glow)' : 'none'
            }}
        >
            {number}
            {/* Seat Visual Details */}
            <div style={{ position: 'absolute', top: '0', left: '10%', right: '10%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '0 0 4px 4px' }} />
            <div style={{ position: 'absolute', bottom: '6px', left: '15%', right: '15%', height: '10px', background: isSelected ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.02)', borderRadius: '4px' }} />
        </div>
    );
}

const Legend = ({ color, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '12px', height: '14px', background: color, borderRadius: '3px', border: '1px solid var(--border-subtle)' }} />
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{label}</span>
    </div>
)

const InfoItem = ({ label, value }) => (
    <div>
        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{value}</div>
    </div>
)

export default BookingFlow;
