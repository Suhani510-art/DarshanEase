
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TempleCard = ({ temple }) => {
  const navigate = useNavigate();

  return (
  <div
    className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden"
    style={{ transition: "all 0.3s ease" }}
  >

    <div style={{ overflow: "hidden" }}>
      <img
        src={temple.image || "https://via.placeholder.com/400x200?text=Temple"}
        alt={temple.name}
        className="card-img-top"
        style={{
          height: "220px",
          objectFit: "cover",
          transition: "transform 0.4s ease",
        }}
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/400x200?text=Temple";
        }}
      />
    </div>

   
    <div className="card-body d-flex flex-column p-4">
      <h5 className="fw-bold mb-2">{temple.name}</h5>

      <p className="text-muted small mb-2">
        📍 {temple.location}
      </p>

      <p className="text-secondary small flex-grow-1">
        {temple.description?.slice(0, 110)}
        {temple.description?.length > 110 ? "..." : ""}
      </p>

      <button
        className="btn btn-dark mt-3 rounded-pill fw-semibold"
        onClick={() => navigate(`/temples/${temple._id}`)}
      >
        View Slots & Book
      </button>
    </div>
  </div>
);
};
export default TempleCard;