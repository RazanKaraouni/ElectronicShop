import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page-section">
      <div className="container pt-5 mt-5 pb-5">
        <div className="row align-items-center g-4">
          <div className="col-md-6 text-md-start text-center">
            <h1
              className="mb-3"
              style={{
                color: '#03363D',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
              }}
            >
              RK Shop
            </h1>
            <p className="mb-4 text-muted">
              Welcome to RK Shop, your destination for the latest electronics. Browse
              phones, laptops, tablets, earbuds, smart watches, and TVs from top brands.
              Find quality devices at competitive prices and shop with confidence.
            </p>
            <Link className="btn btn-primary" to="/products">
              Browse All Products
            </Link>
          </div>
          <div className="col-md-6 text-center">
            <div
              className="card product-card d-inline-block"
              style={{ maxWidth: '650px' }}
            >
              <img
                src="/images/RK.jfif"
                alt="RK Shop"
                className="card-img-top img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
