import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FiSearch, FiArrowRight, FiClock, FiUsers, FiZap } from 'react-icons/fi';
import BookingFlow from '../components/BookingFlow';
import { toast, Toaster } from 'react-hot-toast';

const toastStyle = { style: { background: '#1c1c1c', color: '#f5f0e8', border: '1px solid rgba(201,169,110,0.3)' } };

const Dashboard = () => {
  const [search, setSearch] = useState({ source: '', destination: '', date: new Date().toISOString().split('T')[0] });
  const [schedules, setSchedules] = useState([]);
  const [sources, setSources] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [filters, setFilters] = useState({ busType: 'ALL' });
  const [sortBy, setSortBy] = useState('DEPARTURE');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { fetchLocationOptions(); }, []);

  const fetchLocationOptions = async () => {
    try {
      const [srcRes, destRes] = await Promise.all([api.get('/routes/sources'), api.get('/routes/destinations')]);
      setSources(srcRes.data);
      setDestinations(destRes.data);
    } catch (error) { console.error('Failed to fetch locations', error); }
  };

  const handleSearch = async (e, page = 0) => {
    if (e) e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.get('/schedules/search', { params: { ...search, page, size: 10 } });
      setSchedules(response.data.content || []);
      setCurrentPage(response.data.number || 0);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      toast.error('Search failed. Please try again.', toastStyle);
      setSchedules([]);
    } finally { setLoading(false); }
  };

  const filteredAndSortedSchedules = schedules
    .filter(s => filters.busType === 'ALL' || s.busType === filters.busType)
    .sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.price - b.price;
      if (sortBy === 'PRICE_HIGH') return b.price - a.price;
      if (sortBy === 'DEPARTURE') return (a.departureTime || '').localeCompare(b.departureTime || '');
      return 0;
    });

  const todayStr = new Date().toISOString().split('T')[0];

  const getBusTypeIcon = (type) => {
    if (type === 'SLEEPER') return '🛏';
    if (type === 'AC') return '❄';
    return '🪑';
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Toaster position="bottom-right" />

      {/* ── Hero Section ── */}
      <section style={{ 
        minHeight: '88vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative', 
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(201,169,110,0.07) 0%, transparent 65%), #0a0a0a',
        padding: '60px 24px',
      }}>
        {/* Decorative Elements */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '1px', height: '200px', background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.3), transparent)' }} />
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '1px', height: '200px', background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.3), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(201,169,110,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '780px', animation: 'fadeUp 0.8s ease forwards' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '20px', fontWeight: 500 }}>
            ✦ &nbsp; Premium Bus Travel &nbsp; ✦
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 700, color: '#f5f0e8', lineHeight: 1.05, marginBottom: '24px' }}>
            Travel,<br /><em style={{ color: '#c9a96e', fontStyle: 'italic' }}>Redefined.</em>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#6a5f52', marginBottom: '52px', maxWidth: '480px', margin: '0 auto 52px', lineHeight: 1.8 }}>
            Curated routes. Effortless booking. The seamless bus experience you deserve.
          </p>

          {/* ── Search Card ── */}
          <div style={{ 
            background: 'rgba(20,20,20,0.9)', 
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(201,169,110,0.2)',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '780px',
            margin: '0 auto',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          }}>
            <form onSubmit={handleSearch}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '10px', fontWeight: 600 }}>From</label>
                  <input
                    type="text" placeholder="Origin city" value={search.source}
                    onChange={(e) => setSearch({ ...search, source: e.target.value })}
                    list="sources-list" required
                    style={{ background: '#1c1c1c', border: '1px solid rgba(201,169,110,0.2)', color: '#f5f0e8', padding: '14px 18px', borderRadius: '12px', width: '100%', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif' }}
                  />
                  <datalist id="sources-list">{sources.map(s => <option key={s} value={s} />)}</datalist>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '10px', fontWeight: 600 }}>To</label>
                  <input
                    type="text" placeholder="Destination city" value={search.destination}
                    onChange={(e) => setSearch({ ...search, destination: e.target.value })}
                    list="destinations-list" required
                    style={{ background: '#1c1c1c', border: '1px solid rgba(201,169,110,0.2)', color: '#f5f0e8', padding: '14px 18px', borderRadius: '12px', width: '100%', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif' }}
                  />
                  <datalist id="destinations-list">{destinations.map(d => <option key={d} value={d} />)}</datalist>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '10px', fontWeight: 600 }}>Date</label>
                  <input type="date" min={todayStr} value={search.date}
                    onChange={(e) => setSearch({ ...search, date: e.target.value })}
                    style={{ background: '#1c1c1c', border: '1px solid rgba(201,169,110,0.2)', color: '#f5f0e8', padding: '14px 18px', borderRadius: '12px', width: '100%', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <button type="submit" disabled={loading} style={{ background: '#c9a96e', color: '#0a0a0a', border: 'none', width: '54px', height: '54px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e8d5b0'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#c9a96e'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  {loading ? <span style={{ width: '18px', height: '18px', border: '2px solid rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    : <FiSearch size={20} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── Results Section ── */}
      {hasSearched && (
        <section style={{ padding: '20px 0 80px', background: '#0a0a0a' }}>
          <div className="container">
            {/* Results Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {loading ? 'Searching...' : `${totalElements} Routes Found`}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                   {search.source} <FiArrowRight size={10} style={{margin: '0 4px'}}/> {search.destination} · {search.date}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <select
                  value={filters.busType}
                  onChange={(e) => setFilters({ ...filters, busType: e.target.value })}
                  className="btn-secondary" style={{ borderRadius: '12px', fontSize: '0.8rem' }}
                >
                  <option value="ALL">All Travel Classes</option>
                  <option value="SLEEPER">Luxury Sleeper</option>
                  <option value="NON_AC">Classic Seater</option>
                  <option value="AC">Executive AC</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="btn-secondary" style={{ borderRadius: '12px', fontSize: '0.8rem' }}
                >
                  <option value="DEPARTURE">Sort by Departure</option>
                  <option value="PRICE_LOW">Price: Low to High</option>
                  <option value="PRICE_HIGH">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Cards Grid */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3].map(n => <div key={n} className="skeleton" style={{ height: '140px', borderRadius: '18px' }} />)}
              </div>
            ) : filteredAndSortedSchedules.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredAndSortedSchedules.map((schedule, idx) => (
                  <BusCard 
                    key={schedule.id} 
                    schedule={schedule} 
                    idx={idx} 
                    isExpanded={expandedId === schedule.id}
                    onToggleExpand={() => setExpandedId(expandedId === schedule.id ? null : schedule.id)} 
                  />
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '48px' }}>
                    <button className="btn-secondary" disabled={currentPage === 0} onClick={() => handleSearch(null, currentPage - 1)}>← Previous</button>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Page {currentPage + 1} of {totalPages}</span>
                    <button className="btn-secondary" disabled={currentPage >= totalPages - 1} onClick={() => handleSearch(null, currentPage + 1)}>Next →</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <p style={{ color: 'var(--gold)', fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }}>✦</p>
                <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>No Boutiques Available</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>We couldn't find any premium routes matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {selectedSchedule && (
        <BookingModal schedule={selectedSchedule} onClose={() => setSelectedSchedule(null)} onSuccess={() => { setSelectedSchedule(null); toast.success('Booking confirmed!', toastStyle); }} />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }`}</style>
    </div>
  );
};

const BusCard = ({ schedule, idx, onSelect, isExpanded, onToggleExpand }) => {
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
            <span className="badge badge-pending" style={{ padding: '2px 10px', fontSize: '0.65rem' }}>
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
             <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontStyle: 'italic' }}>{schedule.estimatedDuration}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{schedule.arrivalTime}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{schedule.destination}</div>
          </div>
        </div>

        {/* Price & CTA */}
        <div style={{ textAlign: 'right' }}>
           <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '6px' }}>Starting from</span>
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
            onSuccess={() => { toast.success('Booking journey complete!', toastStyle); onToggleExpand(); }} 
        />
      )}
    </div>
  );
};

export default Dashboard;
