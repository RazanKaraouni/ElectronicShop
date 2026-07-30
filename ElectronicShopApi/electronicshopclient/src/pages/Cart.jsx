import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});
  const [error, setError] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [payment, setPayment] = useState('');
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removeId, setRemoveId] = useState(0);

  const loadCart = async () => {
    try {
      const response = await api.get('/cart/my');
      setItems(response.data);
      const productMap = {};
      for (const item of response.data) {
        const productResponse = await api.get(`/products/${item.productId}`);
        productMap[item.productId] = productResponse.data;
      }
      setProducts(productMap);
    } catch {
      setError('Failed to load cart');
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const getTotal = () =>
    items.reduce((sum, item) => {
      const product = products[item.productId];
      return product ? sum + product.price * item.quantity : sum;
    }, 0);

  const handleRemove = async () => {
    setShowRemoveConfirm(false);
    await api.delete(`/cart/${removeId}`);
    setRemoveId(0);
    loadCart();
  };

  const handleEmptyCart = async () => {
    setShowEmptyConfirm(false);
    for (const item of items) {
      await api.delete(`/cart/${item.id}`);
    }
    loadCart();
  };

  const handleCheckout = async () => {
    if (!payment.trim()) {
      alert('Payment is required');
      return;
    }
    if (Number(payment).toFixed(2) !== getTotal().toFixed(2)) {
      alert('Payment must match the total amount');
      return;
    }

    try {
      await api.post('/cart/checkout', { paymentAmount: Number(payment) });
      setShowCheckout(false);
      setPayment('');
      alert('Order placed successfully!');
      navigate('/my-orders');
    } catch {
      alert('Checkout failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-start">My Cart</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card product-card p-3">
        <table className="table table-bordered table-hover mb-0">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const product = products[item.productId];
              return (
                <tr key={item.id}>
                  <td>{product?.name}</td>
                  <td>${product?.price}</td>
                  <td>{item.quantity}</td>
                  <td>${product ? product.price * item.quantity : 0}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setRemoveId(item.id);
                        setShowRemoveConfirm(true);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showRemoveConfirm && (
        <div className="alert alert-secondary mb-3">
          <p>Are you sure you want to remove this product?</p>
          <button
            className="btn btn-secondary me-2"
            onClick={() => setShowRemoveConfirm(false)}
          >
            No
          </button>
          <button className="btn btn-success" onClick={handleRemove}>
            Yes
          </button>
        </div>
      )}

      <h4>Total: ${getTotal().toFixed(2)}</h4>
      <button
        className="btn btn-primary me-2"
        onClick={() => {
          if (items.length === 0) {
            alert('The cart is EMPTY ! ADD PRODUCTS TO CART FIRST');
            return;
          }
          setShowCheckout(true);
        }}
      >
        Checkout
      </button>
      <button
        className="btn btn-danger"
        onClick={() => {
          if (items.length === 0) {
            alert('The cart is empty');
            return;
          }
          setShowEmptyConfirm(true);
        }}
      >
        Empty Cart
      </button>

      {showEmptyConfirm && (
        <div className="alert alert-secondary mt-3">
          <p>Are you sure you want to empty the cart?</p>
          <button
            className="btn btn-secondary me-2"
            onClick={() => setShowEmptyConfirm(false)}
          >
            No
          </button>
          <button className="btn btn-success" onClick={handleEmptyCart}>
            Yes
          </button>
        </div>
      )}

      {showCheckout && (
        <div className="alert alert-secondary mt-3">
          <input
            type="number"
            placeholder="enter payment"
            className="form-control mb-3"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          />
          <button
            className="btn btn-secondary me-2"
            onClick={() => {
              setShowCheckout(false);
              setPayment('');
            }}
          >
            No
          </button>
          <button className="btn btn-success" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
