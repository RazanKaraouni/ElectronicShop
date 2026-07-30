import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    if (!form.password.trim()) {
      setError('Password is required');
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      navigate(response.data.role === 'Admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card product-card p-4">
            <h2 className="mb-4">Login</h2>
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
                type="password"
                name="password"
                placeholder="Password"
                className="form-control mb-3"
                onChange={handleChange}
              />
              <button className="btn btn-success">Login</button>
            </form>
            <p className="mt-3">
              Do not have an account?{' '}
              <Link to="/register" className="register-link">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
