import React, { useState, useEffect } from 'react';
import { templeAPI, slotAPI } from '../services/api';
import Spinner from '../components/common/Spinner';
import useAuth from '../hooks/useAuth';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [temples, setTemples] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemple, setSelectedTemple] = useState('');
  const [slotForm, setSlotForm] = useState({ date: '', startTime: '', endTime: '', capacity: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const res = await templeAPI.getAll();
        
        const myTemples = res.data.data.filter((t) => t.organizerId?._id === user.id || t.organizerId === user.id);
        setTemples(myTemples);
        if (myTemples.length > 0) setSelectedTemple(myTemples[0]._id);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user.id]);

  useEffect(() => {
    if (selectedTemple) {
      slotAPI.getByTemple(selectedTemple).then((res) => setSlots(res.data.data));
    }
  }, [selectedTemple]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await slotAPI.create({ ...slotForm, templeId: selectedTemple, capacity: parseInt(slotForm.capacity) });
      setMessage('Slot created successfully!');
      setSlotForm({ date: '', startTime: '', endTime: '', capacity: '' });
      const res = await slotAPI.getByTemple(selectedTemple);
      setSlots(res.data.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create slot.');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      await slotAPI.delete(slotId);
      setSlots(slots.filter((s) => s._id !== slotId));
    } catch {
      setMessage('Failed to delete slot.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-1">🗓️ Organizer Dashboard</h3>
      <p className="text-muted mb-4">Manage Darshan slots for your temples.</p>

      {message && <div className="alert alert-info">{message}</div>}
      {temples.length === 0 && (
        <div className="alert alert-warning">No temples assigned to you. Ask an Admin to assign a temple.</div>
      )}

      {temples.length > 0 && (
        <div className="row g-4">
          
          <div className="col-md-5">
            <div className="card shadow-sm border-0 rounded-4 p-4">
              <h5 className="fw-bold mb-3">➕ Add Darshan Slot</h5>
              <form onSubmit={handleCreateSlot}>
                <div className="mb-3">
                  <label className="form-label">Temple</label>
                  <select className="form-select" value={selectedTemple} onChange={(e) => setSelectedTemple(e.target.value)}>
                    {temples.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" value={slotForm.date} onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })} required />
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">Start Time</label>
                    <input type="text" className="form-control" placeholder="06:00 AM" value={slotForm.startTime} onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })} required />
                  </div>
                  <div className="col">
                    <label className="form-label">End Time</label>
                    <input type="text" className="form-control" placeholder="08:00 AM" value={slotForm.endTime} onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Capacity</label>
                  <input type="number" className="form-control" min="1" value={slotForm.capacity} onChange={(e) => setSlotForm({ ...slotForm, capacity: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-warning fw-bold w-100">Create Slot</button>
              </form>
            </div>
          </div>

          
          <div className="col-md-7">
            <h5 className="fw-bold mb-3">Slots for {temples.find((t) => t._id === selectedTemple)?.name}</h5>
            {slots.length === 0 ? (
              <div className="alert alert-info">No slots created yet.</div>
            ) : (
              slots.map((slot) => (
                <div className="card border-0 shadow-sm mb-2 rounded-3" key={slot._id}>
                  <div className="card-body d-flex justify-content-between align-items-center py-2">
                    <div>
                      <strong>{new Date(slot.date).toDateString()}</strong> | {slot.startTime} – {slot.endTime}
                      <br />
                      <small>Booked: {slot.bookedCount}/{slot.capacity}</small>
                    </div>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteSlot(slot._id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;