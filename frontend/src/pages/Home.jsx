import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FiSearch, FiRepeat } from 'react-icons/fi';
import LocationInput from '../components/LocationInput';

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ 
    source: '', 
    destination: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [sources, setSources] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchLocationOptions(); }, []);

  const fetchLocationOptions = async () => {
    try {
      const [srcRes, destRes] = await Promise.all([api.get('/routes/sources'), api.get('/routes/destinations')]);
      setSources(srcRes.data);
      setDestinations(destRes.data);
    } catch (error) { console.error('Failed to fetch locations', error); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(search).toString();
    navigate(`/search?${query}`);
  };

  const handleSwap = () => {
    setSearch({
        ...search,
        source: search.destination,
        destination: search.source
    });
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <section style={{ 
        minHeight: '88vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative', 
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(201,169,110,0.07) 0%, transparent 65%), var(--bg-main)',
        padding: '60px 24px',
      }}>
        {/* Decorative Elements */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '1px', height: '200px', background: 'linear-gradient(to bottom, transparent, var(--border-medium), transparent)' }} />
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '1px', height: '200px', background: 'linear-gradient(to bottom, transparent, var(--border-medium), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(201,169,110,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '820px', animation: 'fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px', fontWeight: 600 }}>
            ✦ &nbsp; Elevating Every Journey &nbsp; ✦
          </p>
          <h1 style={{ marginBottom: '32px' }}>
            Travel,<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Redefined.</em>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '60px', maxWidth: '560px', margin: '0 auto 60px', lineHeight: 1.8 }}>
            Experience the pinnacle of premium bus travel with curated routes and effortless, luxury-first booking.
          </p>

          <div className="glass-card" style={{ 
            padding: '40px 32px',
            maxWidth: '1200px',
            width: '95%',
            margin: '0 auto',
            boxShadow: '0 50px 120px rgba(0,0,0,0.7)',
            borderRadius: '32px',
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.05)',
            boxSizing: 'border-box'
          }}>
            <form onSubmit={handleSearch}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '20px', 
                alignItems: 'end' 
              }}>
                <div style={{ gridColumn: 'span 1' }}>
                  <LocationInput 
                      label="Departure" 
                      placeholder="Origin city" 
                      value={search.source} 
                      onChange={v => setSearch({...search, source: v})}
                      options={sources}
                  />
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '14px',
                  zIndex: 2 
                }}>
                    <button 
                        type="button" 
                        onClick={handleSwap}
                        style={{ 
                            background: 'var(--bg-card)', 
                            border: '1px solid var(--border-medium)',
                            borderRadius: '50%',
                            width: '40px', height: '40px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--gold)',
                            transition: 'all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.transform = 'rotate(180deg) scale(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}
                    >
                        <FiRepeat size={16} />
                    </button>
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                  <LocationInput 
                      label="Destination" 
                      placeholder="Where to?" 
                      value={search.destination} 
                      onChange={v => setSearch({...search, destination: v})}
                      options={destinations}
                  />
                </div>

                <div style={{ textAlign: 'left', gridColumn: 'span 1' }}>
                  <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px', fontWeight: 700 }}>Date</label>
                  <input type="date" min={todayStr} value={search.date}
                    onChange={(e) => setSearch({ ...search, date: e.target.value })}
                    style={{ 
                        height: '60px', 
                        width: '100%',
                        padding: '0 20px', 
                        background: 'var(--bg-elevated)', 
                        borderColor: 'var(--border-subtle)', 
                        borderRadius: '16px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box'
                    }}
                    onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.background = 'rgba(201,169,110,0.05)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.background = 'var(--bg-elevated)'; }}
                  />
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ height: '60px', width: '100%', borderRadius: '16px', fontSize: '1.05rem', fontWeight: 700 }}>
                    {loading ? <span className="spinner" /> : <><FiSearch size={22} style={{ marginRight: '10px' }} /> Search</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <style>{`
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(10,10,10,0.3); border-top-color: #000; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Home;
