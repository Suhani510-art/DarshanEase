import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import Spinner from '../components/common/Spinner';
import useAuth from '../hooks/useAuth';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getMyBookings();
      setBookings(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(bookingId);
    try {
      await bookingAPI.cancel(bookingId);
      setMessage('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cancellation failed.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-1">🙏 Welcome, {user.name}!</h3>
      <p className="text-muted mb-4">Manage your Darshan bookings below.</p>

      {message && <div className="alert alert-info alert-dismissible">{message}</div>}

      {bookings.length === 0 ? (
        <div className="alert alert-warning">You have no bookings yet. <a href="/temples">Browse Temples →</a></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Temple</th>
                <th>Date</th>
                <th>Time</th>
                <th>Persons</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <strong>{b.templeId?.name}</strong>
                    <br />
                    <small className="text-muted">{b.templeId?.location}</small>
                  </td>
                  <td>{b.slotId ? new Date(b.slotId.date).toDateString() : '—'}</td>
                  <td>{b.slotId ? `${b.slotId.startTime} – ${b.slotId.endTime}` : '—'}</td>
                  <td>{b.numberOfPersons}</td>
                  <td>
                    <span className={`badge ${b.status === 'CONFIRMED' ? 'bg-success' : 'bg-secondary'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'CONFIRMED' && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleCancel(b._id)}
                        disabled={cancellingId === b._id}
                      >
                        {cancellingId === b._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;