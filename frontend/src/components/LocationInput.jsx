import React, { useState, useRef, useEffect } from 'react';
import { FiMapPin, FiChevronDown } from 'react-icons/fi';

const LocationInput = ({ label, value, onChange, placeholder, options, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(value.toLowerCase())
  );

  const displayOptions = filteredOptions.slice(0, 6);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', textAlign: 'left' }}>
      
      {/* ── Label (Floating Style) ── */}
      {label && !compact && (
        <div style={{ 
          fontSize: '0.68rem', 
          letterSpacing: '0.25em', 
          textTransform: 'uppercase', 
          color: focused || isOpen ? 'var(--gold)' : 'var(--text-muted)', 
          marginBottom: '12px', 
          fontWeight: 700,
          transition: 'color 0.3s ease'
        }}>
          {label}
        </div>
      )}

      {/* ── Main Input Card ── */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        tabIndex="0"
        style={{ 
          background: focused || isOpen ? 'rgba(201,169,110,0.06)' : 'var(--bg-elevated)',
          border: `1.5px solid ${isOpen ? 'var(--gold)' : focused ? 'var(--gold-dark)' : 'var(--border-subtle)'}`,
          borderRadius: '16px',
          padding: compact ? '12px 18px' : '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          cursor: 'text',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '0 10px 40px rgba(0,0,0,0.4), 0 0 0 4px rgba(201,169,110,0.08)' : 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <FiMapPin size={compact ? 16 : 22} color={isOpen ? 'var(--gold)' : 'var(--text-muted)'} style={{ transition: 'color 0.3s' }} />
        
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
                setIsOpen(true);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ 
                background: 'transparent', 
                border: 'none', 
                width: '100%', 
                color: 'var(--text-primary)',
                fontSize: compact ? '0.92rem' : '1.15rem',
                fontWeight: 600,
                outline: 'none',
                padding: 0,
                letterSpacing: '0.02em'
            }}
          />
        </div>

        <FiChevronDown 
            size={18} 
            color="var(--text-muted)" 
            style={{ 
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                transition: 'transform 0.4s ease',
                opacity: 0.5
            }} 
        />
        
        {/* Glow Overlay */}
        {isOpen && (
            <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '2px',
                background: 'var(--gold)',
                boxShadow: '0 0 10px var(--gold)'
            }} />
        )}
      </div>

      {/* ── Boutique Dropdown ── */}
      {isOpen && (
        <div style={{ 
          position: 'absolute',
          top: 'calc(100% + 10px)',
          left: 0, right: 0,
          background: '#111111', // Opaque dark background
          border: '1px solid var(--border-medium)',
          borderRadius: '16px',
          boxShadow: '0 30px 90px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,169,110,0.1)',
          overflow: 'hidden',
          zIndex: 9999, // Ensure it's on top of EVERYTHING
          animation: 'popIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) both',
          opacity: 1
        }}>
          {displayOptions.length > 0 ? (
              <div style={{ padding: '8px' }}>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Suggested Locations</p>
                {displayOptions.map((opt, i) => (
                    <div 
                        key={i}
                        onClick={() => handleSelect(opt)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(201,169,110,0.1)';
                            e.currentTarget.style.color = 'var(--gold)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        style={{ 
                            padding: '14px 18px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s ease',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <FiMapPin size={14} style={{ opacity: 0.4 }} />
                        {opt}
                    </div>
                ))}
              </div>
          ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No premium routes found for that name.
                </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LocationInput;
