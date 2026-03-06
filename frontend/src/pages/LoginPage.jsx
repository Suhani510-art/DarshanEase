import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
     
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'ORGANIZER') navigate('/organizer');
      else navigate('/temples');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body p-4">
              <h3 className="text-center fw-bold mb-1">🛕 DarshanEase</h3>
              <p className="text-center text-muted mb-4">Login to your account</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-warning w-100 fw-bold" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="mt-3 p-3 rounded" style={{ background: '#fff8e1' }}>
                <small className="text-muted"><strong>Demo Accounts:</strong><br />
                  Admin: admin@darshanease.com / admin123<br />
                  Organizer: organizer@darshanease.com / organizer123<br />
                  User: user@darshanease.com / user123
                </small>
              </div>

              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;