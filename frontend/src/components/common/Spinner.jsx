import React from 'react';

const Spinner = ({ message = 'Loading...' }) => (
  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
    <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3 text-muted">{message}</p>
  </div>
);

export default Spinner;