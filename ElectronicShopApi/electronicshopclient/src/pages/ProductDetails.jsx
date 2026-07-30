import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios.js';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [error, setError] = useState('');
  const [confirmAdd, setConfirmAdd] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const loadProduct = async () => {
    try {
      setProduct((await axios.get(`/api/products/${id}`)).data);
    } catch {
      setError('Failed to load product');
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setConfirmAdd(false);
    try {
      await api.post('/cart', { id: 0, userId: 0, productId: product.id, quantity: 1 });
      alert('Added to cart!');
    } catch {
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-start mb-3">
        <Link className="btn btn-primary" to="/products">
          Back
        </Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        <div className="col-md-6 text-center">
          <img
            src={`/images/${product.imagePath}`}
            className="product-img"
            alt={product.name}
          />
        </div>
        <div className="col-md-6 text-start">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h4 className="mb-3">${product.price}</h4>
          <p className="mb-3">Stock: {product.stock}</p>
          {token && role === 'Customer' && product.stock > 0 && (
            <>
              <button className="btn btn-success" onClick={() => setConfirmAdd(true)}>
                Add to Cart
              </button>
              {confirmAdd && (
                <div className="alert alert-secondary mt-3">
                  <p>Are you sure you want to add it to cart?</p>
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setConfirmAdd(false)}
                  >
                    No
                  </button>
                  <button className="btn btn-success" onClick={handleAddToCart}>
                    Yes
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
