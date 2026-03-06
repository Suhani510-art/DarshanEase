import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/temples');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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
              <p className="text-center text-muted mb-4">Create your account</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required minLength={6} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Register As</label>
                  <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                    <option value="USER">Devotee (User)</option>
                    <option value="ORGANIZER">Temple Organizer</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-warning w-100 fw-bold" disabled={loading}>
                  {loading ? 'Creating account...' : 'Register'}
                </button>
              </form>

              <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;