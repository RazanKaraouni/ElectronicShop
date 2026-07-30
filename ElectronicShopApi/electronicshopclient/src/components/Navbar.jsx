import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container ps-0 d-flex align-items-center">
        {token && (
          <button className="btn btn-primary btn-sm me-2" onClick={handleLogout}>
            Logout
          </button>
        )}
        <div className="navbar-nav ms-auto">
          <Link className="nav-link" to="/">
            Home
          </Link>
          {!token && (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </>
          )}
          {token && role === 'Admin' && (
            <Link className="nav-link" to="/admin">
              Admin Dashboard
            </Link>
          )}
          <Link className="nav-link" to="/products">
            View Products
          </Link>
          {token && role === 'Customer' && (
            <>
              <Link className="nav-link" to="/cart">
                Cart
              </Link>
              <Link className="nav-link" to="/my-orders">
                My Orders
              </Link>
            </>
          )}
          {token && role === 'Admin' && (
            <Link className="nav-link" to="/admin/orders">
              View All Orders
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
