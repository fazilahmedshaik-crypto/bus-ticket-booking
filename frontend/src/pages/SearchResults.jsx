import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FiSearch, FiArrowRight, FiFilter, FiSliders, FiRepeat } from 'react-icons/fi';
import BusCard from '../components/BusCard';
import LocationInput from '../components/LocationInput';
import { toast } from 'react-hot-toast';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState({
    source: searchParams.get('source') || '',
    destination: searchParams.get('destination') || '',
    date: searchParams.get('date') || new Date().toISOString().split('T')[0]
  });

  const [schedules, setSchedules] = useState([]);
  const [sources, setSources] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [filters, setFilters] = useState({ busType: 'ALL' });
  const [sortBy, setSortBy] = useState('DEPARTURE');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchLocationOptions();
    fetchResults();
  }, [searchParams]);

  const fetchLocationOptions = async () => {
    try {
      const [srcRes, destRes] = await Promise.all([api.get('/routes/sources'), api.get('/routes/destinations')]);
      setSources(srcRes.data);
      setDestinations(destRes.data);
    } catch (error) { console.error('Failed to fetch locations', error); }
  };

  const fetchResults = async (page = 0) => {
    setLoading(true);
    setExpandedId(null);
    try {
      const response = await api.get('/schedules/search', { 
        params: { 
            source: searchParams.get('source'),
            destination: searchParams.get('destination'),
            date: searchParams.get('date'),
            page, 
            size: 10 
        } 
      });
      setSchedules(response.data.content || []);
      setCurrentPage(response.data.number || 0);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      toast.error('Failed to fetch schedules.');
      setSchedules([]);
    } finally { setLoading(false); }
  };

  const handleUpdateSearch = (e) => {
    e.preventDefault();
    setSearchParams(search);
  };

  const handleSwap = () => {
      setSearch({ ...search, source: search.destination, destination: search.source });
  };

  const filteredAndSortedSchedules = schedules
    .filter(s => filters.busType === 'ALL' || s.busType === filters.busType)
    .sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return (a.fare || a.price) - (b.fare || b.price);
      if (sortBy === 'PRICE_HIGH') return (b.fare || b.price) - (a.fare || a.price);
      if (sortBy === 'DEPARTURE') return (a.departureTime || '').localeCompare(b.departureTime || '');
      return 0;
    });

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      
      {/* ── Horizontal Search Bar (Sticky) ── */}
      <div style={{ 
        position: 'sticky', top: '64px', zIndex: 100, 
        background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px 0'
      }}>
        <div className="container">
           <form onSubmit={handleUpdateSearch} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto minmax(200px, 1fr) 160px auto', gap: '16px', alignItems: 'center' }}>
                
                <LocationInput 
                    placeholder="Origin" 
                    value={search.source} 
                    onChange={v => setSearch({...search, source: v})}
                    options={sources}
                    compact
                />

                <button 
                    type="button" 
                    onClick={handleSwap}
                    style={{ background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer', opacity: 0.6 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                >
                    <FiRepeat size={14} />
                </button>

                <LocationInput 
                    placeholder="Destination" 
                    value={search.destination} 
                    onChange={v => setSearch({...search, destination: v})}
                    options={destinations}
                    compact
                />

                <input type="date" value={search.date} onChange={e => setSearch({...search, date: e.target.value})} 
                       style={{ 
                           height: '48px', 
                           borderRadius: '12px', 
                           background: 'var(--bg-elevated)', 
                           padding: '0 12px',
                           fontSize: '0.9rem',
                           border: '1px solid var(--border-subtle)'
                       }} />

                <button type="submit" className="btn-primary" style={{ height: '48px', padding: '0 32px', borderRadius: '12px', fontWeight: 600 }}>Modify</button>
           </form>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>
          
          {/* ── Filters & Sort ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                 <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                    {loading ? 'Refreshing Boutique Routes...' : `${totalElements} Options Found`}
                 </h2>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Curated premium journeys for {searchParams.get('date')}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', borderRadius: '100px', padding: '4px 16px', border: '1px solid var(--border-subtle)' }}>
                        <FiFilter size={14} style={{ marginRight: '8px', color: 'var(--gold)' }} />
                        <select value={filters.busType} onChange={e => setFilters({...filters, busType: e.target.value})}
                                style={{ background: 'transparent', border: 'none', padding: '6px', fontSize: '0.85rem', outline: 'none', color: 'var(--text-secondary)' }}>
                            <option value="ALL">All Classes</option>
                            <option value="SLEEPER">Sleeper</option>
                            <option value="AC">Executive AC</option>
                            <option value="NON_AC">Classic</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', borderRadius: '100px', padding: '4px 16px', border: '1px solid var(--border-subtle)' }}>
                        <FiSliders size={14} style={{ marginRight: '8px', color: 'var(--gold)' }} />
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                                style={{ background: 'transparent', border: 'none', padding: '6px', fontSize: '0.85rem', outline: 'none', color: 'var(--text-secondary)' }}>
                            <option value="DEPARTURE">Departure Time</option>
                            <option value="PRICE_LOW">Lowest Price First</option>
                            <option value="PRICE_HIGH">Highest Price First</option>
                        </select>
                    </div>
              </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {loading ? (
                [1, 2, 3].map(n => <div key={n} className="skeleton" style={{ height: '140px', borderRadius: '18px' }} />)
            ) : filteredAndSortedSchedules.length > 0 ? (
                filteredAndSortedSchedules.map((s, idx) => (
                    <BusCard 
                        key={s.id} schedule={s} idx={idx} 
                        isExpanded={expandedId === s.id}
                        onToggleExpand={() => setExpandedId(expandedId === s.id ? null : s.id)}
                    />
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed var(--border-subtle)', borderRadius: '24px' }}>
                    <h3 style={{ color: 'var(--text-muted)' }}>No Search Results Found</h3>
                </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginTop: '60px' }}>
                        <button className="btn-secondary" disabled={currentPage === 0} onClick={() => fetchResults(currentPage - 1)}>← Previous Page</button>
                        <span style={{ fontSize: '0.9rem', color: 'var(--gold)', fontWeight: '600' }}>{currentPage + 1} / {totalPages}</span>
                        <button className="btn-secondary" disabled={currentPage >= totalPages - 1} onClick={() => fetchResults(currentPage + 1)}>Next Page →</button>
                </div>
          )}
      </div>

    </div>
  );
};

export default SearchResults;
