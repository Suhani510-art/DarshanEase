import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { templeAPI, slotAPI } from '../services/api';
import BookingModal from '../components/booking/BookingModal';
import Spinner from '../components/common/Spinner';
import useAuth from '../hooks/useAuth';

const TempleDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    try {
      const [templeRes, slotsRes] = await Promise.all([
        templeAPI.getOne(id),
        slotAPI.getByTemple(id),
      ]);
      setTemple(templeRes.data.data);
      setSlots(slotsRes.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleBookingSuccess = () => {
    setSelectedSlot(null);
    setSuccessMsg(' Booking confirmed! Check your dashboard.');
    fetchData(); 
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  if (loading) return <Spinner />;
  if (!temple) return <div className="container py-5"><div className="alert alert-danger">Temple not found.</div></div>;

  return (
    <div className="container py-4">
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

     
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">

  <div className="temple-hero">
    <img
      src={temple.image}
      alt={temple.name}
      onError={(e) => {
        e.target.src = "https://via.placeholder.com/1200x400?text=Temple";
      }}
    />
  </div>

  <div className="card-body p-4">
    <h2 className="fw-bold">{temple.name}</h2>
    <p className="text-muted">📍 {temple.location}</p>
    <p>{temple.description}</p>
  </div>

</div>

   
      <h4 className="fw-bold mb-3">🕰️ Available Darshan Slots</h4>

      {slots.length === 0 ? (
        <div className="alert alert-info">No slots available for this temple yet.</div>
      ) : (
        <div className="row g-3">
          {slots.map((slot) => {
            const available = slot.capacity - slot.bookedCount;
            const isFull = available === 0;
            return (
              <div className="col-md-4" key={slot._id}>
                <div className={`card border-0 shadow-sm rounded-3 h-100 ${isFull ? 'opacity-75' : ''}`}>
                  <div className="card-body">
                    <h6 className="fw-bold">📅 {new Date(slot.date).toDateString()}</h6>
                    <p className="mb-1">🕐 {slot.startTime} – {slot.endTime}</p>
                    <p className="mb-2">
                      <span className={`badge ${available > 10 ? 'bg-success' : available > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                        {isFull ? 'FULL' : `${available} seats left`}
                      </span>
                      <span className="text-muted small ms-2">Capacity: {slot.capacity}</span>
                    </p>
                    <button
                      className="btn btn-warning btn-sm fw-bold w-100"
                      disabled={isFull || !isAuthenticated}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {!isAuthenticated ? 'Login to Book' : isFull ? 'Slot Full' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    
      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          templeId={temple._id}
          onClose={() => setSelectedSlot(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default TempleDetailPage;