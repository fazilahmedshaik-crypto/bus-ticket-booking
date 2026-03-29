import React, { useState } from 'react';
import { FiUsers, FiArrowRight } from 'react-icons/fi';
import BookingFlow from './BookingFlow';

const BusCard = ({ schedule, idx, isExpanded, onToggleExpand }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-glass)' : 'var(--bg-card)',
        border: `1px solid ${isExpanded ? 'var(--gold)' : hovered ? 'var(--border-medium)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered && !isExpanded ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.5)' : 'none',
        animation: `fadeUp 0.6s ease ${idx * 0.08}s both`,
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {/* Bus Info */}
        <div style={{ flex: '1.2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {schedule.busName}
            </span>
            <span className="badge badge-confirmed" style={{ padding: '2px 10px', fontSize: '0.65rem' }}>
              {schedule.busType?.replace(/_/g, ' ')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--gold)' }}>★ 4.8</span>
            <span>·</span>
            <span>{schedule.operatorName || 'Voyageur Premium'}</span>
          </div>
        </div>

        {/* Timing */}
        <div style={{ flex: '2', display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{schedule.departureTime}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{schedule.source}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
             <div style={{ width: '100px', height: '1.5px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-3px', right: 0, width: '8px', height: '8px', borderRight: '1.5px solid var(--gold)', borderTop: '1.5px solid var(--gold)', transform: 'rotate(45deg)' }} />
             </div>
             <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{schedule.estimatedDuration}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{schedule.arrivalTime}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{schedule.destination}</div>
          </div>
        </div>

        {/* Price & CTA */}
        <div style={{ textAlign: 'right' }}>
           <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '6px' }}>Starting at</span>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: '2rem', fontWeight: 800, color: 'var(--gold)' }}>
                ₹{(schedule.fare || schedule.price).toLocaleString()}
              </div>
           </div>
           <button 
             onClick={onToggleExpand}
             className={isExpanded ? "btn-secondary" : "btn-primary"}
             style={{ padding: '10px 24px', minWidth: '150px' }}
           >
             {isExpanded ? 'Close View' : 'Select Seats →'}
           </button>
        </div>
      </div>

      {/* Expanded Booking Area */}
      {isExpanded && (
        <BookingFlow 
            schedule={schedule} 
            onCancel={onToggleExpand} 
            onSuccess={() => onToggleExpand()} 
        />
      )}
    </div>
  );
};

export default BusCard;
