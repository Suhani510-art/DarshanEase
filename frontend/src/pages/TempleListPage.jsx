import React, { useState, useEffect } from 'react';
import { templeAPI } from '../services/api';
import TempleCard from '../components/temple/TempleCard';
import Spinner from '../components/common/Spinner';

const TempleListPage = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemples = async () => {
  try {
    const { data } = await templeAPI.getAll();

    console.log(data);

   setTemples(data.data );

  } catch {
    setError('Failed to load temples.');
  } finally {
    setLoading(false);
  }
};
    fetchTemples();
  }, []);

  const filtered = temples.filter(
  (t) =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.location?.toLowerCase().includes(search.toLowerCase())
);
  return (
   <div className="container mt-4">
    
      <div
        className="text-center text-white rounded-4 p-5 mb-5"
        style={{ background: 'linear-gradient(135deg, #8B1A1A 0%, #C44B0A 50%, #E8871A 100%)' }}
      >
        <h1 className="display-5 fw-bold">🛕 Find Your Temple</h1>
        <p className="lead">Book your Darshan slot with ease — peaceful, organized, and divine.</p>
        <input
          type="text"
          className="form-control form-control-lg mt-3 mx-auto"
          style={{ maxWidth: '500px' }}
          placeholder="Search by temple name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <Spinner message="Loading temples..." />}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && (
        <>
          <h5 className="text-muted mb-3">{filtered.length} Temple(s) found</h5>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filtered.map((temple) => (
              <div className="col" key={temple._id}>
                <TempleCard temple={temple} />
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center text-muted py-5">
              <h4>No temples found</h4>
              <p>Try a different search term.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TempleListPage;