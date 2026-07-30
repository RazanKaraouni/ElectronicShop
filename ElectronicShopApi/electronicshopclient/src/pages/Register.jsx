import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!form.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!form.email.includes('@') || !form.email.includes('.com')) {
      setError('Email must contain @ and .com');
      return;
    }
    if (!form.password.trim()) {
      setError('Password is required');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await axios.post('/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.status === 400 ? 'Email already exists !' : 'Registration failed',
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card product-card p-4">
            <h2 className="mb-4">Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="form-control mb-3"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control mb-3"
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control mb-3"
                onChange={handleChange}
              />
              <button className="btn btn-primary">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
