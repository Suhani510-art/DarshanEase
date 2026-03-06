import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="container text-center py-5">
    <div style={{ fontSize: '6rem' }}>🛕</div>
    <h1 className="display-4 fw-bold">404</h1>
    <p className="lead text-muted">This page has attained moksha. It no longer exists.</p>
    <Link to="/temples" className="btn btn-warning btn-lg fw-bold mt-3">Return to Temples</Link>
  </div>
);

export default NotFoundPage;