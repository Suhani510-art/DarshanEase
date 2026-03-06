
import React, { useState } from 'react';
import { bookingAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';

const BookingModal = ({ slot, templeId, onClose, onSuccess }) => {
  const { isAuthenticated } = useAuth();
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const available = slot.capacity - slot.bookedCount;

  const handleBook = async () => {
    if (!isAuthenticated) {
      setError('Please login to book a slot.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await bookingAPI.book({
        templeId,
        slotId: slot._id,
        numberOfPersons,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
return (
  <div
    className="modal show d-block"
    tabIndex="-1"
    style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">

       
        <div
          className="modal-header border-0"
          style={{
            background: "linear-gradient(135deg, #8B1A1A, #E8871A)",
            color: "#fff",
          }}
        >
          <h5 className="modal-title fw-bold">
            🛕 Confirm Your Darshan Slot
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
          ></button>
        </div>

    
        <div className="modal-body p-4">

          
          <div className="mb-4">
            <p className="mb-2">
              <strong>Date:</strong> {new Date(slot.date).toDateString()}
            </p>
            <p className="mb-2">
              <strong>Time:</strong> {slot.startTime} – {slot.endTime}
            </p>
            <p className="mb-0">
              <strong>Availability:</strong>{" "}
              <span
                className={`badge px-3 py-2 ${
                  available > 10
                    ? "bg-success"
                    : available > 0
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }`}
              >
                {available} seats left
              </span>
            </p>
          </div>

          
          {available === 0 ? (
            <div className="alert alert-danger rounded-3">
              This slot is fully booked.
            </div>
          ) : (
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Number of Persons
              </label>
              <input
                type="number"
                className="form-control"
                min="1"
                max={Math.min(10, available)}
                value={numberOfPersons}
                onChange={(e) =>
                  setNumberOfPersons(parseInt(e.target.value))
                }
              />
              <small className="text-muted">
                Maximum 10 persons per booking
              </small>
            </div>
          )}

          {error && (
            <div className="alert alert-danger rounded-3">
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer border-0 p-3">
          <button
            className="btn btn-outline-secondary rounded-pill px-4"
            onClick={onClose}
          >
            Cancel
          </button>

          {available > 0 && (
            <button
              className="btn btn-dark rounded-pill px-4 fw-semibold"
              onClick={handleBook}
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          )}
        </div>

      </div>
    </div>
  </div>
);
};
export default BookingModal;